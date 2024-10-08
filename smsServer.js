const express = require('express');
const sendSMS = require('./sendSMS');
const { Webhook } = require('fedapay');
require('dotenv').config();


const endpointSecret = process.env.WEBHOOK_SEC

const app = express();
const bodyParser = require('body-parser');


module.exports = function smsServer() {
    // app.use(express.json());
    // app.use(express.urlencoded({extended: false}));
    
    // Match the raw body to content type application/json
    app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['x-fedapay-signature'];
  
    let event;
  
    try {
      event = Webhook.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }
    let {entity} = event
    console.error("montant ",entity.amount)
    // Handle the event
    switch (event.name) {
      case 'transaction.created':
        // Transaction créée
        break;
      case 'transaction.approved':
        sendSMS(entity.amount, 'approved')
                .then(() => {
                    console.log('SMS envoyé avec succès pour la transaction approuvée.');
                })
                .catch((error) => {
                    console.error('Erreur lors de l\'envoi de l\'SMS pour la transaction approuvée:', error);
                });
        break;
      case 'transaction.canceled':
        // Transaction annulée
        sendSMS(entity.amount, 'canceled')
                .then(() => {
                    console.log('SMS envoyé avec succès pour la transaction approuvée.');
                })
                .catch((error) => {
                    console.error('Erreur lors de l\'envoi de l\'SMS pour la transaction approuvée:', error);
                });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a response to acknowledge receipt of the event
    response.json({received: true});
  });

    // TODO: Incoming messages route
    app.get('/send-sms', async (req, res) => {
        try {
            await sendSMS();
            res.status(200).send('SMS envoyé avec succès');
        } catch (error) {
            res.status(500).send('Erreur lors de l\'envoi de l\'SMS');
        }
    });
    app.get("/", (req, res) => res.send("Express on Vercel"));

    // TODO: Delivery reports route

    const port = process.env.PORT | 3000;

    app.listen(port, () => {
        console.log(`App running on port: ${port}`);

        // TODO: call sendSMS to send message after server starts

    });
};