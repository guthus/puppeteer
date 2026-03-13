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
    await page.goto("https://www.bling.com.br/login", { waitUntil: "networkidle", timeout: 60000 });
    
    console.log("Waiting for username field...");
    await page.waitForSelector("#username", { timeout: 30000 });
    
    console.log("Filling credentials...");
    await page.fill("#username", process.env.BLING_USER, { timeout: 10000 });
    await page.fill("input[type=password]", process.env.BLING_PASS, { timeout: 10000 });
    
    console.log("Submitting form...");
    await page.click("button[type=submit]");
    await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60000 });

    console.log("Going to OS page...");
    await page.goto("https://www.bling.com.br/ordem.servicos.php", { timeout: 60000 });
    await page.waitForTimeout(3000);

    const os = await page.evaluate(() => {
      const linha = document.querySelector("table tbody tr");
      if (!linha) {
        return { erro: "Nenhuma OS encontrada" };
      }
      const colunas = linha.querySelectorAll("td");
      return {
        numero: colunas[1].innerText.trim(),
        cliente: colunas[3].innerText.trim()
      };
    });

    await browser.close();
    res.json(os);
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