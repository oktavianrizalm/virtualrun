'use client'

import { useState } from 'react'
import Tesseract from 'tesseract.js'
import { submitManualRun } from './actions'

export default function UploadScreenshotPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rawText, setRawText] = useState('')
  
  const [distance, setDistance] = useState('')
  const [time, setTime] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    
    // Validasi ukuran 200KB maksimal (200 * 1024 Bytes)
    if (selectedFile.size > 200 * 1024) {
      alert('Maaf, ukuran gambar screenshot maksimal adalah 200KB. Tolong kompres (perkecil) kualitas foto Anda terlebih dahulu untuk menghemat penyimpanan server.')
      e.target.value = '' // Reset input
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setIsProcessing(true)
    
    try {
      // Jalankan proses OCR di sisi client menggunakan Tesseract
      const result = await Tesseract.recognize(selectedFile, 'eng')
      const text = result.data.text
      setRawText(text)
      
      // Auto-extract Distance (mencari pola angka lalu 'km' atau 'mi')
      const distanceMatch = text.match(/([\d]+[.,][\d]+)\s*(km|kilometers|mi|miles|k)/i) || text.match(/([\d]+[.,][\d]+)/)
      if (distanceMatch) {
         setDistance(distanceMatch[1].replace(',', '.'))
      }
      
      // Auto-extract Time
      let parsedTime = ''
      let h = 0, m = 0, s = 0
      
      // Pola 1: Format teks spesifik Apple Watch / Indonesia (contoh: 1j 25m atau 27m 0d)
      const hMatch = text.match(/(\d+)\s*(?:j|h|jam|hour)s?\b/i)
      if (hMatch) h = parseInt(hMatch[1])

      const mMatch = text.match(/(\d+)\s*(?:m|menit|min)s?\b/i)
      if (mMatch) m = parseInt(mMatch[1])

      const sMatch = text.match(/(\d+)\s*(?:d|s|detik|sec)s?\b/i)
      if (sMatch) s = parseInt(sMatch[1])

      if (h > 0 || m > 0 || s > 0) {
         parsedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      } 
      
      // Pola 2: Fallback ke format standar HH:MM:SS atau MM:SS jika tidak ada teks jam/menit
      if (!parsedTime) {
         const time3Part = text.match(/(\d{1,2}:\d{2}:\d{2})/)
         if (time3Part) {
            parsedTime = time3Part[1].padStart(8, '0')
         } else {
            // Mencoba mencari kata kunci Waktu/Time sebelum MM:SS agar tidak tertukar dengan Pace (Kecepatan)
            const waktuDuaPart = text.match(/(?:Waktu|Time|Duration)[\s\n]*(\d{1,2}:\d{2})/i)
            if (waktuDuaPart) {
               const parts = waktuDuaPart[1].split(':')
               parsedTime = `00:${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
            } else {
               // Upaya terakhir, ambil sembarang format MM:SS
               const fallbackMatch = text.match(/(\d{1,2}:\d{2})/)
               if (fallbackMatch) {
                  const parts = fallbackMatch[1].split(':')
                  parsedTime = `00:${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
               }
            }
         }
      }

      if (parsedTime) {
         setTime(parsedTime)
      }
    } catch (err) {
      console.error('OCR Error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 px-8 max-w-3xl mx-auto space-y-8 pb-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black font-headline text-white mb-4">Manual Upload</h1>
        <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">Punya hasil lari dari aplikasi lain? Cukup unggah screenshot-nya di sini! AI kami akan otomatis membaca jarak dan waktu lari Anda.</p>
      </div>
      
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <form action={submitManualRun} className="space-y-6">
          
          <div className="space-y-4">
            <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest">Pilih Gambar Screenshot (Maks: 200KB)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              name="proof_image"
              required
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-zinc-800 file:text-cyan-400 hover:file:bg-zinc-700 transition-all cursor-pointer bg-[#1c1c1e] rounded-xl outline-dashed outline-2 outline-offset-4 outline-zinc-800 p-2"
            />
          </div>

          {preview && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-zinc-800 bg-[#0e0e10] p-2 aspect-video relative flex items-center justify-center">
              <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-xl" />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                   <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(0,203,230,0.5)]"></div>
                   <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm animate-pulse">Memindai Angka dengan AI...</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Jarak Tempuh (KM)</label>
               <input 
                 type="number" 
                 step="0.01"
                 name="distance" 
                 value={distance} 
                 onChange={e => setDistance(e.target.value)}
                 className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-4 py-4 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-lg"
                 required
               />
               <p className="text-[10px] text-zinc-500 tracking-wide mt-1">Kamu bisa mengedit hasil baca AI jika keliru.</p>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Waktu (HH:MM:SS)</label>
               <input 
                 type="text" 
                 name="time" 
                 value={time}
                 onChange={e => setTime(e.target.value)}
                 placeholder="00:30:15"
                 className="w-full bg-[#1c1c1e] border border-transparent rounded-xl px-4 py-4 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-lg"
                 required
               />
               <p className="text-[10px] text-zinc-500 tracking-wide mt-1">Pastikan format waktu seperti HH:MM:SS.</p>
            </div>
          </div>
          
          {rawText && (
             <details className="text-xs text-zinc-500 mt-4 border border-zinc-800 rounded-lg p-3">
                <summary className="cursor-pointer font-bold hover:text-zinc-300">Lihat Hasil Mentah Scan Teks (Developer)</summary>
                <div className="mt-3 p-4 bg-[#0e0e10] rounded-lg overflow-auto max-h-40 whitespace-pre-wrap font-mono text-[10px] text-zinc-400">
                  {rawText}
                </div>
             </details>
          )}

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isProcessing || !file}
              className="w-full bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none hover:bg-emerald-400 text-[#00363e] font-extrabold text-sm tracking-widest uppercase py-5 rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(52,211,153,0.5)] active:scale-[0.98]"
            >
              🚀 Kirim Hasil Lari
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
