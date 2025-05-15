import { NextResponse } from 'next/server'
import { writeFile, unlink, readFile, mkdir } from 'fs/promises'
import path from 'path'

// 팝업 정보를 저장할 JSON 파일 경로
const POPUP_CONFIG_PATH = path.join(process.cwd(), 'public', 'config', 'main-popup.json')

// 팝업 이미지 저장 경로
const POPUP_IMAGE_DIR = path.join(process.cwd(), 'public', 'popups')

// 팝업 설정 타입
interface PopupConfig {
  imageUrl: string;
  isActive: boolean;
  title: string;
}

// GET: 현재 팝업 설정 조회
export async function GET() {
  try {
    const config = await readFile(POPUP_CONFIG_PATH, 'utf-8')
    const parsedConfig = JSON.parse(config)
    console.log('Popup config loaded:', parsedConfig)
    return NextResponse.json(parsedConfig)
  } catch (error) {
    console.log('No popup config found, returning default')
    // 파일이 없는 경우 기본값 반환
    return NextResponse.json({
      imageUrl: '',
      isActive: false,
      title: ''
    })
  }
}

// POST: 새로운 팝업 이미지 업로드 및 설정 저장
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const isActive = formData.get('isActive') === 'true'

    if (!file) {
      return NextResponse.json(
        { error: '파일이 필요합니다.' },
        { status: 400 }
      )
    }

    // 파일 확장자 확인
    const fileExtension = path.extname(file.name).toLowerCase()
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: '지원되지 않는 파일 형식입니다.' },
        { status: 400 }
      )
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 5MB를 초과할 수 없습니다.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 파일명 생성 (timestamp 사용)
    const filename = `main-popup-${Date.now()}${fileExtension}`
    const filepath = path.join(POPUP_IMAGE_DIR, filename)

    // config 디렉토리와 popups 디렉토리가 없다면 생성
    await createDirectoryIfNotExists(path.join(process.cwd(), 'public', 'config'))
    await createDirectoryIfNotExists(POPUP_IMAGE_DIR)

    // 이전 설정 읽기
    let prevConfig: PopupConfig
    try {
      const prevConfigStr = await readFile(POPUP_CONFIG_PATH, 'utf-8')
      prevConfig = JSON.parse(prevConfigStr)
      
      // 이전 이미지 파일 삭제
      if (prevConfig.imageUrl) {
        const prevImagePath = path.join(process.cwd(), 'public', prevConfig.imageUrl)
        await unlink(prevImagePath).catch(() => {})
      }
    } catch (error) {
      prevConfig = {
        imageUrl: '',
        isActive: false,
        title: ''
      }
    }

    // 새 파일 저장
    await writeFile(filepath, buffer)

    // 설정 저장
    const newConfig: PopupConfig = {
      imageUrl: `/popups/${filename}`,
      isActive,
      title: title || '이벤트 안내'
    }
    await writeFile(POPUP_CONFIG_PATH, JSON.stringify(newConfig, null, 2))

    return NextResponse.json({ 
      message: '팝업이 성공적으로 업데이트되었습니다.',
      config: newConfig
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '팝업 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PATCH: 팝업 활성화/비활성화
export async function PATCH(request: Request) {
  try {
    const { isActive } = await request.json()

    let config: PopupConfig
    try {
      const configStr = await readFile(POPUP_CONFIG_PATH, 'utf-8')
      config = JSON.parse(configStr)
    } catch (error) {
      config = {
        imageUrl: '',
        isActive: false,
        title: ''
      }
    }

    config.isActive = isActive
    await writeFile(POPUP_CONFIG_PATH, JSON.stringify(config, null, 2))

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json(
      { error: '팝업 상태 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 팝업 삭제
export async function DELETE() {
  try {
    let config: PopupConfig
    try {
      const configStr = await readFile(POPUP_CONFIG_PATH, 'utf-8')
      config = JSON.parse(configStr)
      
      // 이미지 파일 삭제
      if (config.imageUrl) {
        const imagePath = path.join(process.cwd(), 'public', config.imageUrl)
        await unlink(imagePath).catch(() => {})
      }
    } catch (error) {
      return NextResponse.json({ message: '팝업이 이미 삭제되었습니다.' })
    }

    // 설정 파일 삭제
    await unlink(POPUP_CONFIG_PATH).catch(() => {})

    return NextResponse.json({ message: '팝업이 성공적으로 삭제되었습니다.' })
  } catch (error) {
    return NextResponse.json(
      { error: '팝업 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 디렉토리 생성 유틸리티 함수
async function createDirectoryIfNotExists(dirPath: string) {
  try {
    await readFile(dirPath)
  } catch (error) {
    await mkdir(dirPath, { recursive: true })
  }
} 