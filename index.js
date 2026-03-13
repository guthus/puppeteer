const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.get("/", (req, res) => {
  res.json({ status: "API online" });
});

app.get("/os", async (req, res) => {
  let browser;

  try {
    console.log("Launching browser...");

    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    });

    const page = await browser.newPage();

    console.log("Opening login page...");

    await page.goto("https://www.bling.com.br/login", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    console.log("Waiting login field...");

    await page.waitForSelector('input[name="login"]', {
      timeout: 30000
    });

    console.log("Typing credentials...");

    await page.fill('input[name="login"]', process.env.BLING_USER);
    await page.fill('input[name="password"]', process.env.BLING_PASS);

    console.log("Submitting login...");

    await Promise.all([
      page.click("button[type=submit]"),
      page.waitForNavigation({ waitUntil: "domcontentloaded" })
    ]);

    console.log("Going to OS page...");

    await page.goto("https://www.bling.com.br/ordem.servicos.php", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.waitForTimeout(4000);

    console.log("Extracting OS...");

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

    console.error("Error:", err);

    if (browser) {
      await browser.close();
    }

    res.status(500).json({
      erro: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});