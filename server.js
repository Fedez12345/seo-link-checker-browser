const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.get("/fetch", async (req, res) => {

  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Missing url");
  }

  let browser;

  try {

    browser = await chromium.launch({
      headless: true
    });

    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36"
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.waitForTimeout(3000);

    const html = await page.content();

    res.send(html);

  } catch (e) {

    res.status(500).send(String(e));

  } finally {

    if (browser) {
      await browser.close();
    }
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
