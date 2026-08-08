const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function fetchGoMechanicSummerBanners() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  const networkImages = [];
  page.on("response", (response) => {
    const url = response.url();
    if (url.match(/\.(png|jpg|jpeg|webp)(\?.*)?$/i)) {
      networkImages.push(url);
    }
  });

  await page.goto("https://gomechanic.in/mumbai", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 4000));

  const domCards = await page.evaluate(() => {
    const allImgs = Array.from(document.querySelectorAll("img"));
    return allImgs
      .map((i) => ({
        src: i.src,
        alt: i.alt,
        className: i.className,
      }))
      .filter((i) => i.src.includes("gumlet") || i.src.includes("blob") || i.src.includes("gomech"));
  });

  const outputData = {
    domCards,
    networkImages: networkImages.filter(
      (u) => u.includes("gomech") || u.includes("gumlet") || u.includes("summer") || u.includes("category") || u.includes("addons")
    ),
  };

  fs.writeFileSync(path.join(__dirname, "summer-urls.json"), JSON.stringify(outputData, null, 2));
  console.log("Saved summer-urls.json successfully!");

  await browser.close();
}

fetchGoMechanicSummerBanners().catch(console.error);
