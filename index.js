const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/os", async (req, res) => {

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto("https://www.bling.com.br/login");

  await page.type("input[name=login]", process.env.BLING_USER);
  await page.type("input[name=password]", process.env.BLING_PASS);

  await page.click("button[type=submit]");

  await page.waitForNavigation();

  await page.goto("https://www.bling.com.br/ordem.servicos.php");

  await page.waitForTimeout(4000);

  const os = await page.evaluate(() => {

    const linha = document.querySelector("table tbody tr");

    const numero = linha.querySelectorAll("td")[1].innerText;
    const cliente = linha.querySelectorAll("td")[3].innerText;

    return {
      numero,
      cliente
    };

  });

  await browser.close();

  res.json(os);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});