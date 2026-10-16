import { TikTokDL } from '@tobyg74/tiktok-api-dl';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response(JSON.stringify({ error: 'Link TikTok wajib diisi!' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await TikTokDL(url);
    const videoUrl = data.result.video[0] || data.result.video; 

    const response = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream',
    });

    return new Response(response.data, {
      headers: {
        'Content-Disposition': 'attachment; filename="tiktok-clean.mp4"',
        'Content-Type': 'video/mp4',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal mengambil video. Pastikan link benar.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
