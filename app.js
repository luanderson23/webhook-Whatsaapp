const express = require("express");
const axios = require("axios").default;
const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {
  let body = req.body;
 
  console.log(JSON.stringify(req.body, null, 2));

  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let phonenumber = req.body.entry[0].changes[0].value.messages[0].from;
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;

      // Extração de dados adicionais
      let messageId = req.body.entry[0].changes[0].value.messages[0].id;
      let field = req.body.entry[0].changes[0].field;
      let timestamp = req.body.entry[0].changes[0].value.messages[0].timestamp;
      let waId = req.body.entry[0].changes[0].value.contacts[0].wa_id;
      let nomedocontato = req.body.entry[0].changes[0].value.contacts[0].profile.name;
      let display_phone_number = req.body.entry[0].changes[0].value.metadata.display_phone_number;

      // Salvar os dados na primeira coleção
      try {
        const response1 = await axios.post('https://luandersoncesar.wixstudio.io/whatsapp/_functions/whatsappWebhook', {
          imagemDePerfil: "https://static.wixstatic.com/shapes/c14309_ac6f1add0c55432f843b51a56ea82aa0.svg",
          tipo: 'recebida', // Definindo o campo 'tipo' como 'recebida'
          phonenumber,
          content: msg_body,
          messageId,
          field,
          timestamp,
          waId,
          nomedocontato,
          phone_number_id,
          display_phone_number,
        });

        console.log('Dados salvos no Wix (1):', response1.data);
      } catch (error) {
        console.error('Erro ao salvar os dados no Wix (1):', error);
      }

      // Salvar os dados na segunda coleção
      try {
        const response2 = await axios.post('https://luandersoncesar.wixstudio.io/whatsapp/_functions/whatsappWebhookModified', {
          imagemDePerfil: "https://static.wixstatic.com/shapes/c14309_ac6f1add0c55432f843b51a56ea82aa0.svg",
          tipo: 'recebida', // Definindo o campo 'tipo' como 'recebida'
          phonenumber,
          content: msg_body,
          messageId,
          field,
          timestamp,
          waId,
          nomedocontato,
          phone_number_id,
          display_phone_number,
        });

        console.log('Dados salvos no Wix (2):', response2.data);
      } catch (error) {
        console.error('Erro ao salvar os dados no Wix (2):', error);
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/webhook", (req, res) => {
  // Seu código para validação do webhook

  // Restante do código
});

app.listen(process.env.PORT || 1337, () => {
  console.log("Webhook está ouvindo...");
});
