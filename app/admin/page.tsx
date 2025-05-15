"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react'

const SECTIONS = [
  { id: 'iv', name: '수액센터' },
  { id: 'obesity', name: '비만센터' },
  { id: 'hair', name: '탈모센터' }
]

export default function AdminPage() {
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0].id)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentPopup, setCurrentPopup] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 메인 팝업 상태
  const [mainPopup, setMainPopup] = useState<{
    imageUrl: string;
    isActive: boolean;
    title: string;
  } | null>(null)
  const [mainPopupFile, setMainPopupFile] = useState<File | null>(null)
  const [mainPopupTitle, setMainPopupTitle] = useState('')
  const [mainPopupPreview, setMainPopupPreview] = useState<string | null>(null)

  // 현재 선택된 섹션의 팝업 이미지 로드
  useEffect(() => {
    const fetchPopupImage = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/admin/popup?section=${selectedSection}`)
        if (response.ok) {
          const data = await response.json()
          setCurrentPopup(data.imageUrl)
        } else {
          const errorData = await response.json()
          setError(errorData.error || '이미지 로드 중 오류가 발생했습니다.')
        }
      } catch (error) {
        console.error('팝업 이미지 로드 실패:', error)
        setError('이미지 로드 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopupImage()
  }, [selectedSection])

  // 메인 팝업 데이터 로드
  useEffect(() => {
    fetchMainPopup()
  }, [])

  const fetchMainPopup = async () => {
    try {
      const response = await fetch('/api/admin/main-popup')
      if (response.ok) {
        const data = await response.json()
        setMainPopup(data)
        setMainPopupTitle(data.title || '')
      }
    } catch (error) {
      console.error('메인 팝업 로드 실패:', error)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.')
        return
      }

      // 파일 형식 체크
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        alert('지원되는 파일 형식: JPG, PNG, GIF')
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('section', selectedSection)

    try {
      const response = await fetch('/api/admin/popup', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentPopup(data.imageUrl)
        setSelectedFile(null)
        setPreviewUrl(null)
        alert('팝업 이미지가 성공적으로 업로드되었습니다.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || '업로드 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.')
      alert(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentPopup) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/popup?section=${selectedSection}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCurrentPopup(null)
        alert('팝업 이미지가 삭제되었습니다.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || '삭제 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      setError(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 메인 팝업 파일 선택 핸들러
  const handleMainPopupFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainPopupFile(file)
      setMainPopupPreview(URL.createObjectURL(file))
    }
  }

  // 메인 팝업 업로드 핸들러
  const handleMainPopupUpload = async () => {
    if (!mainPopupFile) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', mainPopupFile)
    formData.append('title', mainPopupTitle)
    formData.append('isActive', mainPopup?.isActive ? 'true' : 'false')

    try {
      const response = await fetch('/api/admin/main-popup', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setMainPopup(data.config)
        setMainPopupFile(null)
        setMainPopupPreview(null)
        alert('메인 팝업이 업데이트되었습니다.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || '업로드 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.')
      alert(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 메인 팝업 활성화/비활성화 토글
  const toggleMainPopupActive = async () => {
    if (!mainPopup) return

    try {
      const response = await fetch('/api/admin/main-popup', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !mainPopup.isActive,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMainPopup(data)
      } else {
        throw new Error('상태 업데이트 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Toggle error:', error)
      alert('팝업 상태 변경 중 오류가 발생했습니다.')
    }
  }

  // 메인 팝업 삭제
  const handleMainPopupDelete = async () => {
    if (!mainPopup?.imageUrl || !confirm('메인 팝업을 삭제하시겠습니까?')) return

    try {
      const response = await fetch('/api/admin/main-popup', {
        method: 'DELETE',
      })

      if (response.ok) {
        setMainPopup(null)
        setMainPopupTitle('')
        alert('메인 팝업이 삭제되었습니다.')
      } else {
        throw new Error('삭제 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('팝업 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">관리자 모드</h1>
      
      {/* 메인 팝업 관리 섹션 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">메인 팝업 관리</h2>
        
        {/* 현재 메인 팝업 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">현재 메인 팝업</h3>
          {mainPopup?.imageUrl ? (
            <div className="relative">
              <Image
                src={mainPopup.imageUrl}
                alt="현재 메인 팝업"
                width={400}
                height={300}
                className="rounded-lg"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={toggleMainPopupActive}
                  className={`p-2 rounded-full ${
                    mainPopup.isActive
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  } text-white`}
                  title={mainPopup.isActive ? '팝업 비활성화' : '팝업 활성화'}
                >
                  {mainPopup.isActive ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={handleMainPopupDelete}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  title="팝업 삭제"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-gray-600">{mainPopup.title}</p>
            </div>
          ) : (
            <p className="text-gray-500">현재 설정된 메인 팝업이 없습니다.</p>
          )}
        </div>

        {/* 새 메인 팝업 업로드 */}
        <div>
          <h3 className="text-lg font-medium mb-2">새 메인 팝업 업로드</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              팝업 제목
            </label>
            <input
              type="text"
              value={mainPopupTitle}
              onChange={(e) => setMainPopupTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="팝업 제목을 입력하세요"
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleMainPopupFileSelect}
              className="hidden"
              id="main-popup-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="main-popup-upload"
              className={`cursor-pointer flex flex-col items-center justify-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-gray-600">클릭하여 이미지 선택</span>
              <span className="text-sm text-gray-500 mt-1">
                지원 형식: JPG, PNG, GIF (최대 5MB)
              </span>
            </label>
          </div>

          {/* 미리보기 */}
          {mainPopupPreview && (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">미리보기</h4>
              <Image
                src={mainPopupPreview}
                alt="미리보기"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          )}

          {/* 업로드 버튼 */}
          {mainPopupFile && (
            <button
              onClick={handleMainPopupUpload}
              disabled={isLoading}
              className={`mt-4 w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? '업로드 중...' : '업로드'}
            </button>
          )}
        </div>
      </div>

      {/* 기존 섹션별 팝업 관리 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">섹션별 팝업 관리</h2>
        
        {/* 섹션 선택 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">섹션 선택</h3>
          <div className="flex space-x-4">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`px-4 py-2 rounded-lg ${
                  selectedSection === section.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* 현재 팝업 이미지 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">현재 팝업 이미지</h3>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : currentPopup ? (
            <div className="relative">
              <Image
                src={currentPopup}
                alt="현재 팝업"
                width={400}
                height={300}
                className="rounded-lg"
                onError={() => setError('이미지를 불러올 수 없습니다.')}
              />
              <button
                onClick={handleDelete}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                disabled={isLoading}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <p className="text-gray-500">현재 설정된 팝업 이미지가 없습니다.</p>
          )}
        </div>

        {/* 이미지 업로드 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">새 팝업 이미지 업로드</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileSelect}
              className="hidden"
              id="popup-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="popup-upload"
              className={`cursor-pointer flex flex-col items-center justify-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-gray-600">클릭하여 이미지 선택</span>
              <span className="text-sm text-gray-500 mt-1">
                지원 형식: JPG, PNG, GIF (최대 5MB)
              </span>
            </label>
          </div>

          {/* 미리보기 */}
          {previewUrl && (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">미리보기</h4>
              <Image
                src={previewUrl}
                alt="미리보기"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          )}

          {/* 업로드 버튼 */}
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className={`w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? '업로드 중...' : '업로드'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 