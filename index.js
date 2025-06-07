const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const NUMERO_PESSOAL = '5511954052773'; // seu número no formato internacional
const ZAPI_URL = 'https://api.z-api.io/instances/3E261FD5D6656047EE494A39F5505F78/token/2720038D3F57BE03A7957D1A/send-text';

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const body = req.body;

  // Verifica se tem mensagem recebida
  if (body.message && body.message.text && body.message.from) {
    const texto = body.message.text.toLowerCase();
    const numeroCliente = body.message.from;

    if (texto.includes('preço') || texto.includes('precos') || texto.includes('valores')) {
      const resposta = `Para ver os valores dos produtos, fale com nosso especialista: https://wa.me/${NUMERO_PESSOAL}`;

      try {
        await axios.post(ZAPI_URL, {
          phone: numeroCliente,
          message: resposta,
        });
        console.log(`✅ Mensagem enviada para ${numeroCliente}`);
      } catch (error) {
        console.error('❌ Erro ao enviar:', error.message);
      }
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});