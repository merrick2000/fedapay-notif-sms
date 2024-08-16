// import { Infobip, AuthType } from "@infobip-api/sdk";

const { Infobip, AuthType } = require("@infobip-api/sdk");

const baseUrl = process.env.BASE_URL
const key = process.env.KEY

let infobip = new Infobip({
    baseUrl,
    apiKey: key,
    authType: AuthType.ApiKey,
});

// const africastalking = require("africastalking");
// const smsServer = require("./smsServer");

// const api = africastalking({
//     apiKey: 'atsk_9a0ec72929a6deefefc36f78cb98264c9bf454a51500e21535df0de7267417e7b2e93807', 
//     username: 'webdevjean9'
//   });

async function sendSMS() {
    try {
        
        const result = await infobip.channels.sms.send({
            type: 'text',
            messages: [{
                destinations: [{to: '+22962384867'}],
                text: `New order on Fedapay of `,
                from: "New order"
            }]

        });
        // const result = await api.SMS.send({
        //   to: ['+22962384867'], 
        //   message: 'Hey Merrick, new order from your store...'
        // });
        console.log(result);
      } catch(ex) {
        console.error(ex);
      } 
}

module.exports = sendSMS
   