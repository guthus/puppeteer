


const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

app.get("/os", async (req, res) => {
  try {
const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});
    const page = await browser.newPage();
    await page.goto("https://www.bling.com.br/login", {waitUntil:"networkidle2"});

    await page.waitForSelector('input[name="login"]');

    await page.type('input[name="login"]', process.env.BLING_USER);
    await page.type('input[name="password"]', process.env.BLING_PASS);

    await page.click("button[type=submit]");

    await page.waitForNavigation({waitUntil:"networkidle2"});
    await page.goto("https://www.bling.com.br/ordem.servicos.php");
    await page.waitForTimeout(3000);
    const os = await page.evaluate(() => {
      const linha = document.querySelector("table tbody tr");
      const numero = linha.querySelector("td").innerText;
      const cliente = linha.querySelectorAll("td")[3].innerText;
      return { numero, cliente };
    });
    await browser.close();
    res.json(os);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("running on port 3000"));

app.get("/", (req, res) => {
  res.json({ message: "Puppeteer scraper running", endpoint: "/os" });
});