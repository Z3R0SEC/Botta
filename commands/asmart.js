const axios = require('axios');
const { sendButton, sendMessage, sendImage } = require('../handles/sendMessage'); // Add sendImage function

module.exports = {
   name: 'smart',
   description: 'Chat with AI that can send images',
   usage: 'smart <message>',
   author: 'Mota - Dev',

   async execute(senderId, args, pageAccessToken, user) {
      const prompt = args.join(' '); // Combine args to form the message
      const id = senderId;
      const token = pageAccessToken;

      // Random default message list
      const defaultMessages = [
         "Yo, Sup?",
         "Yo, What's the Word?",
         "Need Something?",
         "Listening...",
         "What's New Dude?"
      ];
      const tcr = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

      if (!prompt) {
         return sendMessage(id, { text: tcr }, token);
      }

      const apiParams = {
         user: id,
         prompt: prompt
      };
      const apiUrl = "https://raaj-api.x10.bz/smart";  // Assuming the new API for smart responses

      try {
         const response = await axios.get(apiUrl, { params: apiParams });

         if (response.data.reply) {
            // Send a text reply if available
            return sendButton(id, `${response.data.reply}`, [ { type: "web_url", title: "DONATE", url: "https://pay.capitecbank.co.za/payme/ZST5XN" } ], token);
         } else if (response.data.image) {
            // Send an image if provided in response
            const attachment = {
                type: 'image',
                payload: { response.data.image },
            };
            return await sendMessage(id, { attachment }, token);
         } else if (response.data.error) {
            return sendButton(id, `${response.data.error}`, [ { type: "web_url", title: "DONATE", url: "https://pay.capitecbank.co.za/payme/ZST5XN" } ], token);
         } else {
            return sendMessage(id, { text: "Unexpected response from AI." }, token);
         }
      } catch (error) {
         console.error('Error while communicating with AI API:', error);
         return sendMessage(id, { text: "An error occurred while processing your request. Please try again later." }, token);
      }
   }
};
