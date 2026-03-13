const express = require("express");
const { chromium } = require("playwright");
const app = express();

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/test", async (req, res) => {
  try {
    console.log("Starting browser...");
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    console.log("Browser started");
    
    const page = await browser.newPage();
    console.log("Page created");
    
    await page.goto("https://example.com", { timeout: 10000 });
    console.log("Page loaded");
    
    const title = await page.title();
    await browser.close();
    
    res.json({ title });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});