const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const API_URL = 'https://api.z-api.io/instances/3E261FD5D6656047EE494A39F5505F78/token/2720038D3F57BE03A7957D1A';
const NUMERO_PESSOAL = '5511954052773'; // Seu número com DDI + DDD

const PALAVRAS_CHAVE = ['preço', 'valores', 'quanto', 'custa', 'preços'];

app.post('/webhook', async (req, res) => {
    const mensagem = req.body.message?.text?.body?.toLowerCase();
    const telefoneCliente = req.body.message?.from;

    if (mensagem && telefoneCliente) {
        const encontrou = PALAVRAS_CHAVE.some(p => mensagem.includes(p));

        if (encontrou) {
            const resposta = `Olá! 😊 Para ver os valores dos produtos, fale diretamente com nosso especialista no WhatsApp: https://wa.me/${NUMERO_PESSOAL}`;

            try {
                await axios.post(`${API_URL}/send-messages`, {
                    phone: telefoneCliente,
                    message: resposta
                });
                console.log(`Mensagem enviada para ${telefoneCliente}`);
            } catch (error) {
                console.error('Erro ao enviar:', error.response?.data || error.message);
            }
        }
    }

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Bot rodando na porta 3000');
});
