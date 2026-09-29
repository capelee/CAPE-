import { audioContextManager } from "./audioEffects";

// Extract YouTube ID from robust URLs
export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  // Robust support for YouTube Shorts URLs
  if (url.includes("/shorts/")) {
    const parts = url.split("/shorts/");
    const idPart = parts[1]?.split(/[?&#]/)[0];
    if (idPart && idPart.length === 11) {
      return `https://www.youtube.com/embed/${idPart}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
    }
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
  }
  return null;
}

export function extractDriveIdsFromHtml(html: string, folderId: string): string[] {
  if (!html) return [];

  const cleanHtml = html
    .replace(/\\x22/g, '"')
    .replace(/\\x27/g, "'")
    .replace(/\\x5b/g, '[')
    .replace(/\\x5d/g, ']')
    .replace(/\\x2c/g, ',')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  const results: Array<{ id: string; name: string }> = [];
  const seenIds = new Set<string>();

  const fileArrayRegex = /["']([a-zA-Z0-9_-]{28,45})["']\s*,\s*\[\s*([^\]]*)\s*\]\s*,\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']/g;
  
  let match;
  while ((match = fileArrayRegex.exec(cleanHtml)) !== null) {
    const [_, fileId, parentsStr, fileName, mimeType] = match;
    const isImage = mimeType.toLowerCase().includes('image') || 
                    /\.(jpe?g|png|gif|webp|bmp|heic)$/i.test(fileName) ||
                    mimeType.includes('octet-stream');
                    
    if (fileId && fileId !== folderId && !seenIds.has(fileId)) {
      const isParentMatch = !folderId || parentsStr.includes(folderId) || parentsStr.length === 0;
      if (isParentMatch && isImage) {
        seenIds.add(fileId);
        results.push({ id: fileId, name: fileName });
      }
    }
  }

  if (results.length === 0) {
    const fileIdRegexes = [
      /\/file\/d\/([a-zA-Z0-9_-]{28,45})/g,
      /id=([a-zA-Z0-9_-]{28,45})/g,
      /\/thumbnail\?id=([a-zA-Z0-9_-]{28,45})/g,
      /drive-viewer\/([a-zA-Z0-9_-]{28,45})/g
    ];

    for (const regex of fileIdRegexes) {
      let matchId;
      while ((matchId = regex.exec(cleanHtml)) !== null) {
        const fileId = matchId[1];
        if (fileId && fileId !== folderId && fileId.length >= 28 && !seenIds.has(fileId)) {
          seenIds.add(fileId);
          results.push({ id: fileId, name: `file_${fileId}.png` });
        }
      }
    }
  }

  results.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  return results.map(r => `https://drive.google.com/thumbnail?sz=w1000&id=${r.id}`);
}

export async function fetchFolderImages(folderId: string): Promise<string[]> {
  const targetUrl = `https://drive.google.com/drive/folders/${folderId}`;
  
  const proxies = [
    (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&_t=${Date.now()}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now())}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];

  const maxRetries = 3;
  const delayMs = (retryCount: number) => Math.pow(2, retryCount) * 1000;

  for (let retry = 0; retry < maxRetries; retry++) {
    for (let i = 0; i < proxies.length; i++) {
      const getProxyUrl = proxies[i];
      const proxyUrl = getProxyUrl(targetUrl);
      
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        let html = "";
        if (i === 0) {
          const data = await response.json();
          html = data.contents || "";
        } else {
          html = await response.text();
        }

        if (html) {
          const images = extractDriveIdsFromHtml(html, folderId);
          if (images.length > 0) {
            console.log(`Successfully fetched folder ${folderId} images via proxy ${i + 1} on attempt ${retry + 1}`);
            return images;
          }
        }
      } catch (err) {
        console.warn(`Proxy ${i + 1} failed on attempt ${retry + 1}:`, err);
      }
    }
    
    if (retry < maxRetries - 1) {
      const wait = delayMs(retry);
      console.log(`Retrying folder ${folderId} fetch in ${wait}ms...`);
      await new Promise(resolve => setTimeout(resolve, wait));
    }
  }

  console.error(`All proxies failed to fetch folder ${folderId} images after ${maxRetries} retries.`);
  return [];
}

// 『叮！』魔法施法聲效 (Magic Ding Casting Sound)
export const playMagicDingSound = () => {
  try {
    const ctx = audioContextManager.getOrCreateContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.8);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, now);
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.6);

    osc3.type = "sine";
    osc3.frequency.setValueAtTime(987.77, now);
    osc3.frequency.exponentialRampToValueAtTime(783.99, now + 0.7);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.07, now + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + 1.3);
    osc2.stop(now + 1.3);
    osc3.stop(now + 1.3);
  } catch (e) {
    // Safety fallback
  }
};
