const express = require("express");
const { chromium } = require("playwright");
const app = express();

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/os", async (req, res) => {
  let browser;
  try {
    console.log("Starting browser...");
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    });

    const page = await browser.newPage();
    console.log("Navigating to login...");
    await page.goto("https://www.bling.com.br/login", { waitUntil: "networkidle", timeout: 30000 });
    
    console.log("Page loaded, taking screenshot...");
    await page.screenshot({ path: "/tmp/login.png" });
    
    console.log("Getting page content...");
    const content = await page.content();
    console.log("HTML length:", content.length);
    
    // Log all input fields
    const inputs = await page.locator("input").all();
    console.log("Found inputs:", inputs.length);
    
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute("type");
      const name = await inputs[i].getAttribute("name");
      const id = await inputs[i].getAttribute("id");
      console.log(`Input ${i}: type=${type}, name=${name}, id=${id}`);
    }

    await browser.close();
    res.json({ debug: "Check logs" });
  } catch (err) {
    console.error("Error:", err.message);
    if (browser) await browser.close();
    res.status(500).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});