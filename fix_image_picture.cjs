const fs = require('fs');
const filePath = 'src/components/ImageWithFallback.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Add getSrcSet function inside the component
content = content.replace(
  /const imageClass = `\$\{baseImgClass\}/,
  `const getSrcSet = (format?: "webp" | "jpeg") => {
    if (fallbackAttempt !== 0) return undefined;
    if (!src) return undefined;
    
    // Check if it's a URL that supports dynamic resizing
    const isDynamic = src.includes("images.unsplash.com") || 
                     src.includes("res.cloudinary.com") || 
                     src.includes(".imgix.net") || 
                     src.includes("imgix=");
                     
    if (!isDynamic) return undefined;

    const baseW = optimizeSize || containerWidth;
    if (!baseW) return undefined;

    return \`\${resolveImageUrl(src, baseW, format)} 1x, \${resolveImageUrl(src, baseW * 2, format)} 2x, \${resolveImageUrl(src, baseW * 3, format)} 3x\`;
  };
  
  const imageClass = \`\${baseImgClass}`
);

// Replace the <img> rendering block
const imgBlock = `{currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
          style={imageStyle}
          className={imageClass}
          referrerPolicy={referrerPolicy}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchPriority: "high" } : {})}
        />
      )}`;

const pictureBlock = `{currentSrc && (
        <picture>
          {fallbackAttempt === 0 && (src.includes('images.unsplash.com') || src.includes('res.cloudinary.com') || src.includes('.imgix.net') || src.includes('imgix=')) && (
            <>
              <source type="image/webp" srcSet={getSrcSet("webp")} />
              <source type="image/jpeg" srcSet={getSrcSet("jpeg")} />
            </>
          )}
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            decoding="async"
            style={imageStyle}
            className={imageClass}
            referrerPolicy={referrerPolicy}
            loading={priority ? "eager" : "lazy"}
            {...(priority ? { fetchPriority: "high" } : {})}
          />
        </picture>
      )}`;

content = content.replace(imgBlock, pictureBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done replacing ImageWithFallback with <picture>');
