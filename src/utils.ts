export const YT_THUMBNAIL_CACHE = new Map<string, string>();
export const DRIVE_THUMBNAIL_CACHE = new Map<string, string>();

try {
  const storedYt = localStorage.getItem("yt_thumbnail_cache");
  if (storedYt) {
    const parsed = JSON.parse(storedYt);
    Object.entries(parsed).forEach(([key, value]) => {
      YT_THUMBNAIL_CACHE.set(key, value as string);
    });
    console.log(`[YT Cache Init] Loaded ${YT_THUMBNAIL_CACHE.size} entries from local persistence.`);
  }

  const storedDrive = localStorage.getItem("drive_thumbnail_cache");
  if (storedDrive) {
    const parsed = JSON.parse(storedDrive);
    Object.entries(parsed).forEach(([key, value]) => {
      DRIVE_THUMBNAIL_CACHE.set(key, value as string);
    });
    console.log(`[Drive Cache Init] Loaded ${DRIVE_THUMBNAIL_CACHE.size} entries from local persistence.`);
  }
} catch (e) {
  console.log("[Media Cache Init Error]", e);
}

export function saveYtCacheToStorage() {
  try {
    const obj = Object.fromEntries(YT_THUMBNAIL_CACHE.entries());
    localStorage.setItem("yt_thumbnail_cache", JSON.stringify(obj));
  } catch (e) {
    console.log("[YT Cache Save Error]", e);
  }
}

export function saveDriveCacheToStorage() {
  try {
    const obj = Object.fromEntries(DRIVE_THUMBNAIL_CACHE.entries());
    localStorage.setItem("drive_thumbnail_cache", JSON.stringify(obj));
  } catch (e) {
    console.log("[Drive Cache Save Error]", e);
  }
}

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/watch")) {
    const match = url.match(/[?&]v=([^&#?]+)/);
    if (match) return match[1];
  }
  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts.length > 1) return parts[1].split(/[?#&]/)[0];
  }
  const match = url.match(/\/vi\/([^/\?]+)/);
  if (match) return match[1];
  return null;
}

export function extractDriveId(url: string): string | null {
  if (!url) return null;
  if (url.startsWith("/images/optimized/")) {
    const filename = url.replace("/images/optimized/", "");
    return filename.replace(".webp", "").split("?")[0];
  }
  if (url.includes("lh3.googleusercontent.com/d/")) {
    const parts = url.split("lh3.googleusercontent.com/d/");
    if (parts.length > 1) {
      return parts[1].split("=")[0].split("?")[0];
    }
  }
  if (url.includes("id=")) {
    const match = url.match(/[?&]id=([^&#?]+)/);
    if (match) return match[1];
  }
  const match = url.match(/\/file\/d\/([^/\?]+)/);
  if (match) return match[1];
  return null;
}

export function getOptimizedGoogleUrl(url: string, size?: number): string {
  if (!url) return "";
  const id = extractDriveId(url);
  
  let extraParams = "";
  if (url.includes("?")) {
    const query = url.split("?")[1];
    const params = query.split("&").filter(p => !p.startsWith("id=") && !p.startsWith("sz="));
    if (params.length > 0) {
      extraParams = "&" + params.join("&");
    }
  } else if (url.includes("&")) {
    const params = url.split("&").filter(p => !p.startsWith("id=") && !p.startsWith("sz="));
    if (params.length > 0) {
      extraParams = "&" + params.join("&");
    }
  }

  if (id) {
    const s = size ? size : 600;
    const busterValue = Math.floor(Date.now() / 120000);
    const busterParam = `&v=${busterValue}`;
    const finalExtraParams = extraParams.includes("&v=") ? extraParams : `${extraParams}${busterParam}`;
    return `https://drive.google.com/thumbnail?sz=w${s}&id=${id}${finalExtraParams}`;
  }
  if (url.includes("lh3.googleusercontent.com")) {
    const cleanUrl = url.split("=")[0];
    if (size) {
      return `${cleanUrl}=w${size}-rw`;
    }
    return cleanUrl;
  }
  return url;
}

export function resolveImageUrl(url: string, size?: number): string {
  if (!url) return "";
  
  // Support robust base URL prefixed absolute paths for local image assets.
  // This automatically handles subdirectories (e.g. GitHub Pages) and respects absolute routing sub-folders.
  const isLocalImage = (url.startsWith("/") || url.startsWith("./")) && url.includes("/images/") && !url.includes("/images/optimized/");
  if (isLocalImage) {
    const relativePart = url.startsWith("/") ? url.slice(1) : url.startsWith("./") ? url.slice(2) : url;
    // @ts-ignore
    const baseUrl = import.meta.env.BASE_URL || "/";
    const formattedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    return `${formattedBase}${relativePart}`;
  }
  
  // Support subdirectory hosting (e.g. GitHub Pages) by resolving local domain-relative paths relative to Vite base URL
  let targetUrl = url;
  if (url.startsWith("/") && !url.startsWith("/images/optimized/") && !url.startsWith("//")) {
    // @ts-ignore
    const baseUrl = import.meta.env.BASE_URL || "/";
    const formattedBase = baseUrl.startsWith("/") 
      ? (baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`) 
      : `/${baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`}`;
    const relativePath = url.slice(1);
    
    if (!url.startsWith(formattedBase)) {
      targetUrl = `${formattedBase}${relativePath}`;
    }
  }

  // Intercept YouTube thumbnail calls with cached working formats if any exist
  const ytId = extractYoutubeId(targetUrl);
  if (ytId && YT_THUMBNAIL_CACHE.has(ytId)) {
    const cachedType = YT_THUMBNAIL_CACHE.get(ytId)!;
    if (targetUrl.includes("maxresdefault.jpg")) {
      targetUrl = targetUrl.replace("maxresdefault.jpg", cachedType);
      console.log(`[resolveImageUrl:CACHE_HIT] Instantly resolved working thumbnail format for YouTube ${ytId} -> ${cachedType}`);
    }
  }

  const id = extractDriveId(targetUrl);
  
  let extraParams = "";
  if (targetUrl.includes("?")) {
    const query = targetUrl.split("?")[1];
    const params = query.split("&").filter(p => !p.startsWith("id=") && !p.startsWith("sz="));
    if (params.length > 0) {
      extraParams = "&" + params.join("&");
    }
  } else if (targetUrl.includes("&")) {
    const params = targetUrl.split("&").filter(p => !p.startsWith("id=") && !p.startsWith("sz="));
    if (params.length > 0) {
      extraParams = "&" + params.join("&");
    }
  }

  if (id) {
    const s = size ? size : 1000;

    // Use a stable 2-minute cache buster to force browsers and CDN gateways to fetch the latest version 
    // of modified files while preventing visual flashes on every single re-render.
    const busterValue = Math.floor(Date.now() / 120000);
    const busterParam = `&v=${busterValue}`;
    const finalExtraParams = extraParams.includes("&v=") ? extraParams : `${extraParams}${busterParam}`;

    if (DRIVE_THUMBNAIL_CACHE.has(id)) {
      const cachedUrlType = DRIVE_THUMBNAIL_CACHE.get(id);
      if (cachedUrlType === 'view') {
        return `https://drive.google.com/uc?export=view&id=${id}${finalExtraParams}`;
      } else if (cachedUrlType === 'lh3') {
        return `https://lh3.googleusercontent.com/d/${id}=w${s}${finalExtraParams}`;
      }
    }
    
    // Default: Use high-availability Drive thumbnail API to completely bypass CORS 403 and referrer limits
    return `https://drive.google.com/thumbnail?sz=w${s}&id=${id}${finalExtraParams}`;
  }
  // Support Unsplash dynamic image scaling
  if (targetUrl.includes("images.unsplash.com")) {
    const s = size ? size : 600;
    try {
      const urlObj = new URL(targetUrl);
      urlObj.searchParams.set("w", s.toString());
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("fit", "crop");
      urlObj.searchParams.set("q", "80");
      return urlObj.toString();
    } catch (e) {
      let baseUrl = targetUrl.split("?")[0];
      return `${baseUrl}?w=${s}&auto=format&fit=crop&q=80`;
    }
  }

  // Support Cloudinary dynamic image scaling
  if (targetUrl.includes("res.cloudinary.com")) {
    const s = size ? size : 600;
    if (targetUrl.includes("/upload/")) {
      const parts = targetUrl.split("/upload/");
      const prefix = parts[0];
      let suffix = parts[1];
      if (suffix.match(/w_\d+/)) {
        suffix = suffix.replace(/w_\d+/, `w_${s}`);
      } else {
        suffix = `f_auto,q_auto,w_${s}/${suffix}`;
      }
      return `${prefix}/upload/${suffix}`;
    }
  }

  // Support Imgix dynamic image scaling
  if (targetUrl.includes(".imgix.net") || targetUrl.includes("imgix=")) {
    const s = size ? size : 600;
    try {
      const urlObj = new URL(targetUrl);
      urlObj.searchParams.set("w", s.toString());
      urlObj.searchParams.set("auto", "format,compress");
      return urlObj.toString();
    } catch (e) {
      let baseUrl = targetUrl.split("?")[0];
      return `${baseUrl}?w=${s}&auto=format,compress`;
    }
  }

  return getOptimizedGoogleUrl(targetUrl, size);
}
