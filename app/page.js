'use client';
import { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!inputUrl) return setError('Silakan masukkan tautan TikTok terlebih dahulu!');
    
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(inputUrl)}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal memproses video.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TokClean-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sistem. Coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Efek Cahaya Latar Belakang */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="py-5 px-6 max-w-5xl mx-auto w-full flex items-center justify-between border-b border-neutral-900/60 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 bg-clip-text text-transparent tracking-wider">
          TOKCLEAN.IO
        </h1>
        <span className="text-xs font-semibold bg-neutral-900/90 border border-neutral-800 text-cyan-400 px-3 py-1.5 rounded-full shadow-inner animate-pulse">
          ⚡ Ultra Fast Engine v2
        </span>
      </header>

      {/* Konten Utama */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 max-w-3xl mx-auto w-full text-center py-16 relative z-10">
        <div className="space-y-4 mb-10">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            TikTok Video <br />
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">Tanpa Watermark</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Unduh video tanpa logo secara instan. Cukup tempel tautan, klik, dan simpan dengan kualitas HD terbaik.
          </p>
        </div>

        {/* Panel Box Utama */}
        <div className="w-full bg-neutral-900/40 p-6 rounded-3xl border border-neutral-800/80 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleDownload} className="flex flex-col gap-3">
            <div className="relative flex items-center">
              <input
                type="url"
                required
                placeholder="Tempel tautan video TikTok di sini..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full bg-neutral-950/80 border border-neutral-800 px-5 py-4 text-sm text-neutral-200 outline-none rounded-2xl focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-neutral-600"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 via-pink-500 to-rose-500 text-white font-bold text-sm py-4 rounded-2xl hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none tracking-wide shadow-xl shadow-pink-500/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menghubungkan Server...
                </>
              ) : (
                'MULAI UNDUH INSTAN'
              )}
            </button>
          </form>

          {/* Notifikasi Status & Eror */}
          {error && (
            <div className="mt-4 text-xs font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl transition-all">
              🚨 {error}
            </div>
          )}
        </div>

        {/* Info Tambahan */}
        <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-md text-center">
          <div className="p-3 bg-neutral-900/20 rounded-xl border border-neutral-900"><p className="text-xs text-neutral-500">Kualitas</p><p className="text-sm font-bold text-neutral-300">HD / .MP4</p></div>
          <div className="p-3 bg-neutral-900/20 rounded-xl border border-neutral-900"><p className="text-xs text-neutral-500">Kecepatan</p><p className="text-sm font-bold text-neutral-300">Tanpa Limit</p></div>
          <div className="p-3 bg-neutral-900/20 rounded-xl border border-neutral-900"><p className="text-xs text-neutral-500">Kompatibel</p><p className="text-sm font-bold text-neutral-300">Semua Perangkat</p></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-600 border-t border-neutral-900/40 backdrop-blur-sm">
        &copy; 2026 TokClean Premium. Dibuat secara eksklusif untuk kemudahan berbagi konten.
      </footer>
    </div>
  );
}
