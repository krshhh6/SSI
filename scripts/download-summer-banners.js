const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function downloadSummerBanners() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1200 });

  console.log("Navigating to GoMechanic Mumbai...");
  await page.goto("https://gomechanic.in/mumbai", { waitUntil: "networkidle2" });

  // Scroll down to trigger lazy loading of summer banners
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight / 2) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  await new Promise((r) => setTimeout(r, 3000));

  // Find all images under summer section or banner cards
  const bannerImages = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs.map((i) => ({
      src: i.src,
      alt: i.alt,
      width: i.naturalWidth,
      height: i.naturalHeight,
      parentClass: i.parentElement ? i.parentElement.className : "",
    }));
  });

  fs.writeFileSync(path.join(__dirname, "all-images.json"), JSON.stringify(bannerImages, null, 2));
  console.log("Saved all-images.json with", bannerImages.length, "images");

  await browser.close();
}

downloadSummerBanners().catch(console.error);
