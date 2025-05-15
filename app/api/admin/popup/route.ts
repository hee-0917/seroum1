import { NextResponse } from 'next/server'
import { writeFile, unlink, access } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const section = formData.get('section') as string

    if (!file || !section) {
      return NextResponse.json(
        { error: '파일과 섹션 정보가 필요합니다.' },
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

    // 파일 저장 경로 설정 (섹션별로 구분)
    const filename = `popup-${section}${fileExtension}`
    const filepath = path.join(process.cwd(), 'public', filename)

    // 파일 저장
    await writeFile(filepath, buffer)

    return NextResponse.json({ 
      message: '파일이 성공적으로 업로드되었습니다.',
      imageUrl: `/${filename}`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    if (!section) {
      return NextResponse.json(
        { error: '섹션 정보가 필요합니다.' },
        { status: 400 }
      )
    }

    const extensions = ['.jpg', '.jpeg', '.png', '.gif']
    let foundImage = null

    // 해당 섹션의 팝업 이미지 찾기
    for (const ext of extensions) {
      const filepath = path.join(process.cwd(), 'public', `popup-${section}${ext}`)
      try {
        await access(filepath)
        foundImage = `popup-${section}${ext}`
        break
      } catch {
        continue
      }
    }

    return NextResponse.json({ 
      imageUrl: foundImage ? `/${foundImage}` : null
    })
  } catch (error) {
    console.error('Get popup error:', error)
    return NextResponse.json(
      { error: '팝업 이미지 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    if (!section) {
      return NextResponse.json(
        { error: '섹션 정보가 필요합니다.' },
        { status: 400 }
      )
    }

    const extensions = ['.jpg', '.jpeg', '.png', '.gif']
    let deleted = false

    // 해당 섹션의 모든 가능한 팝업 이미지 삭제 시도
    for (const ext of extensions) {
      const filepath = path.join(process.cwd(), 'public', `popup-${section}${ext}`)
      try {
        await unlink(filepath)
        deleted = true
        break
      } catch {
        continue
      }
    }

    if (deleted) {
      return NextResponse.json({ 
        message: '파일이 성공적으로 삭제되었습니다.' 
      })
    } else {
      return NextResponse.json(
        { error: '삭제할 파일을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: '파일 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 