const express = require("express");
const axios = require("axios");

const app = express();

app.get("/os", async (req, res) => {

  try {

    const response = await axios.post(
      "https://www.bling.com.br/services/ordem.servicos.server.php?f=listarOrdensServicos",
      "xajax=%23Services%5COrdemServico%5C%23listarOrdensServicos&xajaxr=1",
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": "Mozilla/5.0",
          "origin": "https://www.bling.com.br",
          "referer": "https://www.bling.com.br/ordem.servicos.php",
          "cookie": process.env.BLING_COOKIE
        }
      }
    );

    res.json(response.data);

  } catch (err) {

    res.status(500).json({
      erro: err.message
    });

  }

});

app.listen(process.env.PORT || 3000);