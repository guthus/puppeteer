const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/", (req, res) => {
  res.send("API online");
});
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});
app.get("/os", async (req, res) => {

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  });

  try {

    const page = await browser.newPage();

    await page.goto("https://www.bling.com.br/login");

    await page.waitForSelector('input[name="login"]');

    await page.type('input[name="login"]', process.env.BLING_USER);
    await page.type('input[name="password"]', process.env.BLING_PASS);

    await Promise.all([
      page.click("button[type=submit]"),
      page.waitForNavigation({ waitUntil: "domcontentloaded" })
    ]);

    // ir para tela de OS
    await page.goto("https://www.bling.com.br/ordem.servicos.php");

    await page.waitForTimeout(5000);

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

    await browser.close();

    res.json({
      erro: err.message
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});