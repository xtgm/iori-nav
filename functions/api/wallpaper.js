
import { jsonResponse, errorResponse } from '../_middleware';

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const source = url.searchParams.get('source') || 'bing';
  const cid = url.searchParams.get('cid') || '36';
  const country = url.searchParams.get('country') || '';
  const indexStr = url.searchParams.get('index') || '-1';
  let currentIndex = parseInt(indexStr);
  if (isNaN(currentIndex)) currentIndex = -1;

  try {
    let targetUrl = '';
    let nextIndex = 0;

    if (source === '360') {
      const apiUrl = `http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&from=360chrome&cid=${cid}&start=0&count=8`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.errno === "0" && json.data && json.data.length > 0) {
          nextIndex = (currentIndex + 1) % json.data.length;
          const targetItem = json.data[nextIndex];
          if (targetItem.url) {
            targetUrl = targetItem.url.replace('http://', 'https://');
          }
        }
      }
    } else {
      // Default to Bing
      let bingUrl = '';
      if (country === 'spotlight') {
        bingUrl = 'https://peapix.com/spotlight/feed?n=7';
      } else {
        bingUrl = `https://peapix.com/bing/feed?n=7&country=${country}`;
      }
      const res = await fetch(bingUrl);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          nextIndex = (currentIndex + 1) % data.length;
          const targetItem = data[nextIndex];
          targetUrl = targetItem.fullUrl || targetItem.url;
        }
      }
    }

    if (targetUrl) {
      return jsonResponse({
        code: 200,
        data: {
          url: targetUrl,
          index: nextIndex
        }
      });
    } else {
      return errorResponse('Failed to fetch wallpaper', 500);
    }
  } catch (e) {
    return errorResponse(`Error: ${e.message}`, 500);
  }
}
