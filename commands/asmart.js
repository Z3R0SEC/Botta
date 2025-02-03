const axios = require('axios');                            const { sendButton, sendMessage } = require('../handles/sendMessage');

module.exports = {
   name: 'ai',                                             description: 'Chat with an AI',
   usage: 'ai <message>',
   author: 'Mota - Dev',

   async execute(senderId, args, pageAccessToken, user) {
      const prompt = args.join(' '); // Combine args to form the message
      const id = senderId;
      const token = pageAccessToken;

      // Random default message list
      const defaultMessages = [
         "Yo, Sup?",                                                "Yo, What's the Word?",
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
      const apiUrl = "https://mota-api.x10.bz/api/ai";

      try {
         const response = await axios.get(apiUrl, { params: apiParams });

         if (response.data.reply) {
            return sendButton(id, `${response.data.reply}`, [ { type: "web_url", title: "DONATE", url: "https://pay.capitecbank.co.za/payme/ZST5XN" } ], token);
         } else if (response.data.image) {
            const url = response.data.image;
            const attachment = {
               type: 'image',
               payload: { url },
            };
            return await sendMessage(id, { attachment }, token);
         } else if (response.data.song) {
            const url = response.data.song;
            const attachm = { 
               type: 'audio',
               payload: { url: url, is_reusable: true },
            };
            await sendMessage(id, { text:  `Title: ${response.data.title}\n\nSong Below!` }, token);
            return await sendMessage(id, { attachm }, token);
         } else if (response.data.error) {
            return sendMessage(id, { text: `Error: ‹ ${response.data.error} ›` }, token);
         } else {
            return sendMessage(id, { text: "RaaJ Api Returned Unexpected Data!" }, token);
         }
      } catch (error) {
         console.error('Error while communicating with AI API:', error);
         return sendMessage(id, { text: error }, token);
      }
   }
};
