export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Tautan video wajib diisi!' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Memanggil API publik pihak ketiga yang sangat stabil dan ramah link HP
    const cleanUrl = targetUrl.split('?')[0];
    const fetchApi = await fetch(`https://eu.org{encodeURIComponent(cleanUrl)}`);
    
    if (!fetchApi.ok) throw new Error('Server pemroses sedang sibuk.');
    
    const resData = await fetchApi.json();
    const videoDownloadUrl = resData.video?.noWatermark || resData.video?.watermark;

    if (!videoDownloadUrl) throw new Error('Gagal mengekstrak video tanpa watermark.');

    const videoStream = await fetch(videoDownloadUrl);
    const videoBlob = await videoStream.blob();

    return new Response(videoBlob, {
      headers: {
        'Content-Disposition': `attachment; filename="TokClean-${Date.now()}.mp4"`,
        'Content-Type': 'video/mp4',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Gagal memproses video.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
