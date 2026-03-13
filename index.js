const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.json({ status: "online" });
});

app.get("/os", async (req, res) => {
  try {

    const response = await axios.post(
      "https://www.bling.com.br/services/ordem.servicos.server.php?f=listarOrdensServicos",
      "xajax=%23Services%5COrdemServico%5C%23listarOrdensServicos&xajaxr=1",
      {
	headers: {
  "content-type": "application/x-www-form-urlencoded",
  cookie: `PHPSESSID=${process.env.PHPSESSID}; PCSID=${process.env.PCSID}`
}
        }
      }
    );

    const data = response.data;

    res.json(data);

  } catch (err) {

    res.status(500).json({
      erro: err.message
    });

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("running", PORT);
});