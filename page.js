// app/page.js
'use client';
import { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!inputUrl) return setError('Silakan masukkan link TikTok terlebih dahulu!');
    
    setError('');
    setLoading(true);

    try {
      // Memanggil API backend yang sudah kita buat sebelumnya
      const response = await fetch(`/api/download?url=${encodeURIComponent(inputUrl)}`);
      
      if (!response.ok) throw new Error('Gagal mengunduh video. Pastikan link benar atau coba lagi.');

      // Mengubah respons menjadi file untuk diunduh otomatis di browser
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "tiktok-no-watermark.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-pink-500 selection:text-white">
      {/* Header */}
      <header className="py-6 px-4 max-w-4xl mx-auto w-full flex items-center justify-between border-b border-slate-900">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
          TokClean.io
        </h1>
        <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full">
          ⚡ Gratis & Tanpa Batas
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full text-center py-12">
        <div className="space-y-4 mb-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            TikTok Downloader <br />
            <span className="text-cyan-400">Tanpa Watermark</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
            Unduh video TikTok favoritmu dengan kualitas HD terbaik dan bersih dari logo watermark dalam sekali klik.
          </p>
        </div>

        {/* Form Input URL */}
        <form onSubmit={handleDownload} className="w-full bg-slate-900/50 p-2 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col sm:flex-row gap-2 shadow-2xl">
          <input
            type="url"
            placeholder="Tempel tautan video TikTok di sini..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-grow bg-transparent px-4 py-3.5 text-sm text-slate-200 outline-none rounded-xl focus:bg-slate-900 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-pink-500/20"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Memproses...
              </>
            ) : 'Unduh Sekarang'}
          </button>
        </form>

        {/* Notifikasi Error */}
        {error && (
          <div className="mt-4 text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl">
            ⚠️ {error}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-600 border-t border-slate-900">
        &copy; 2026 TokClean. Dibuat hanya untuk keperluan edukasi.
      </footer>
    </div>
  );
}
