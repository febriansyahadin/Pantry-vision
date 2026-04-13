'use client'
import { useState, DragEvent, ChangeEvent } from 'react'

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{label: string, confidence: number} | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = (selectedFile: File) => {
    if (selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setResult(null)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) processFile(droppedFile)
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) processFile(selectedFile)
  }

  const resetData = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }

  const formatLabel = (label: string) => {
    return label.split('_').join(' ')
  }

  const runAnalysis = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      alert("Koneksi gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <a href="/" className="flex items-center gap-2">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="font-bold text-lg">Pantry Vision</h1>
        </div>
        </a>
        
        <nav className="flex-1 py-6">
          <p className="px-6 text-xs font-bold text-green-600 mb-2">Utama</p>
          <a href="/dashboard" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 font-medium">
            <span className="mr-3">Dashboard</span> 
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 font-medium">
            <span className="mr-3">Inventori</span> 
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 font-medium">
            <span className="mr-3">Sensor</span>
          </a>
          <a href="/scan" className="flex items-center px-6 py-3 bg-gray-100 border-l-4 border-green-600 text-green-700 font-bold">
            <span className="mr-3">Scan</span> 
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 font-medium">
            <span className="mr-3">Riwayat Scan</span> 
          </a>
          
          <p className="px-6 text-xs font-bold text-gray-400 mb-2 mt-8">Akun</p>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 font-medium">
            <span className="mr-3">Profile</span> 
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 font-medium">
            <span className="mr-3">LogOut</span> 
          </a>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-medium">Scan Bahan</h2>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">👤</div>
        </header>

        <div className="p-8">
          <div className="max-w-4xl mx-auto py-8 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-5xl font-extrabold leading-tight mb-6">Pindai bahan makananmu sekarang</h2>
              <p className="text-lg text-gray-500 mb-8">Unggah foto untuk melihat tingkat kesegaran bahan secara langsung.</p>
            </div>

            <div className="space-y-6">
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative h-80 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} ${preview ? 'border-none' : ''}`}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <div className="text-4xl mb-4">☁️</div>
                    <p className="font-bold text-gray-800">Tarik gambar ke sini</p>
                    <p className="text-sm text-gray-400 mt-1">Atau klik area ini</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileInput} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={runAnalysis}
                  disabled={!file || loading}
                  className="flex-1 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl transition-all disabled:bg-gray-100 disabled:text-gray-300 active:scale-95"
                >
                  {loading ? 'Memproses...' : 'Analisis'}
                </button>
                {preview && (
                  <button 
                    onClick={resetData}
                    className="px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-lg transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>

              {result && (
                <div className="p-8 bg-white rounded-3xl border border-gray-100 animate-in fade-in zoom-in duration-300 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Identifikasi</h3>
                      <p className="text-3xl font-black capitalize mt-1">{formatLabel(result.label)}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase">Confidence</span>
                      <span className="text-lg font-black text-gray-800">{result.confidence}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}