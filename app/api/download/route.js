import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Tautan video wajib diisi!' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (targetUrl.includes('://tiktok.com') || targetUrl.includes('://tiktok.com')) {
      const redirectRes = await axios.head(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        maxRedirects: 5,
      });
      targetUrl = redirectRes.request.res.responseUrl || targetUrl;
    }

    const videoIdMatch = targetUrl.match(/\/video\/(\d+)/) || targetUrl.match(/\/v\/(\d+)/);
    if (!videoIdMatch) throw new Error('Format link TikTok tidak dikenali. Gunakan link video yang valid.');
    
    const videoId = videoIdMatch[1];
    const apiUrl = `https://tiktokv.com{videoId}`;

    const apiResponse = await axios.get(apiUrl, {
      headers: { 'User-Agent': 'com.ss.android.ugc.trill/494+ (Linux; U; Android 12; en_US; OpenData)' }
    });

    const awemeList = apiResponse.data?.aweme_list?.[0];
    const cleanVideoUrl = awemeList?.video?.play_addr?.url_list?.[0];
    if (!cleanVideoUrl) throw new Error('Gagal mengekstrak video tanpa watermark.');

    const videoStream = await axios({
      url: cleanVideoUrl,
      method: 'GET',
      responseType: 'stream',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    return new Response(videoStream.data, {
      headers: {
        'Content-Disposition': `attachment; filename="TokClean-${videoId}.mp4"`,
        'Content-Type': 'video/mp4',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Server sibuk. Gagal memproses video.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
