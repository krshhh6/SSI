const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const imagesToProcess = [
  { input: "bumper.jpg", output: "bumper.png" },
  { input: "seat.jpg", output: "seat.png" },
  { input: "sideMirror.jpg", output: "sideMirror.png" },
  { input: "suspension.webp", output: "suspension.png" },
  { input: "wheel.jpg", output: "wheel.png" },
  { input: "AC.jpg", output: "AC.png" },
  { input: "brakes.png", output: "brakes_clean.png" },
  { input: "battery.jpg", output: "battery.png" },
  { input: "light.jpg", output: "light.png" },
];

// Potential browser paths on Windows
const browserPaths = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

let executablePath = null;
for (const p of browserPaths) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

async function removeWhiteBackgrounds() {
  console.log("Using browser at:", executablePath);
  const browser = await puppeteer.launch({
    executablePath: executablePath || undefined,
    headless: true,
  });
  const page = await browser.newPage();

  for (const item of imagesToProcess) {
    const inputPath = path.join(publicDir, item.input);
    const outputPath = path.join(publicDir, item.output);

    if (!fs.existsSync(inputPath)) {
      console.warn(`File not found: ${inputPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(inputPath);
    const ext = path.extname(item.input).replace(".", "");
    const base64Img = `data:image/${ext === "webp" ? "webp" : "jpeg"};base64,${fileBuffer.toString("base64")}`;

    const pngBase64 = await page.evaluate(async (dataUrl) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          // Target white background removal
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Check if pixel is white / light-gray background
            if (r > 200 && g > 200 && b > 200) {
              const avg = (r + g + b) / 3;
              if (avg > 235) {
                data[i + 3] = 0; // Pure transparent
              } else if (avg > 200) {
                // Feather edge
                const alpha = (235 - avg) / 35;
                data[i + 3] = Math.floor(Math.max(0, alpha) * 255);
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.src = dataUrl;
      });
    }, base64Img);

    const base64Data = pngBase64.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(outputPath, Buffer.from(base64Data, "base64"));
    console.log(`Successfully generated transparent PNG: ${item.output}`);
  }

  await browser.close();
  console.log("All transparent PNGs created successfully!");
}

removeWhiteBackgrounds().catch((err) => {
  console.error("Error removing backgrounds:", err);
});
