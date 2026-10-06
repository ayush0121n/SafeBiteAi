export interface LabelQualityResult {
  score: number;          // 0-100
  isAcceptable: boolean;
  issues: string[];
  suggestions: string[];
}

export async function assessLabelQuality(file: File): Promise<LabelQualityResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({ score: 50, isAcceptable: true, issues: [], suggestions: [] });
        return;
      }

      // Resize for performance
      const maxSize = 800;
      let width = img.width;
      let height = img.height;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // 1. Resolution check
      const megapixels = (img.width * img.height) / 1_000_000;
      let score = 100;
      const issues: string[] = [];
      const suggestions: string[] = [];

      if (megapixels < 0.5) {
        score -= 30;
        issues.push("Low resolution");
        suggestions.push("Move closer or use a higher resolution camera");
      }

      // 2. Brightness
      let totalBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      const avgBrightness = totalBrightness / (data.length / 4);

      if (avgBrightness < 60) {
        score -= 25;
        issues.push("Image too dark");
        suggestions.push("Improve lighting");
      } else if (avgBrightness > 200) {
        score -= 15;
        issues.push("Image too bright / overexposed");
        suggestions.push("Reduce glare or bright light");
      }

      // 3. Simple blur detection (Laplacian variance approximation)
      // Higher variance = sharper
      let variance = 0;
      const gray: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        gray.push((data[i] + data[i + 1] + data[i + 2]) / 3);
      }

      // Very simple edge energy
      let edgeSum = 0;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          const gx = gray[idx + 1] - gray[idx - 1];
          const gy = gray[idx + width] - gray[idx - width];
          edgeSum += Math.abs(gx) + Math.abs(gy);
        }
      }
      const edgeDensity = edgeSum / (width * height);

      if (edgeDensity < 15) {
        score -= 30;
        issues.push("Image appears blurry");
        suggestions.push("Hold the camera steady and ensure the text is in focus");
      }

      score = Math.max(0, Math.min(100, score));

      URL.revokeObjectURL(url);

      resolve({
        score: Math.round(score),
        isAcceptable: score >= 55,
        issues,
        suggestions,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ score: 40, isAcceptable: false, issues: ["Could not read image"], suggestions: ["Try another photo"] });
    };

    img.src = url;
  });
}
