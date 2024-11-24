const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
   name: 'ai',
   description: 'Chat With an ai',
   usage: 'ai <message>',
   author: 'Mota - Dev',

   async execute(senderId, args, pageAccessToken, user) {
      const prompt = args.join(' ');
      const id = senderId;
      const token = pageAccessToken;

      const msgs = ["Yo, Sup ?", "Yo, Whats The Word ?", "Need Something ?", "Listening ...", "Whats New Dude ?"];
      const idid = msgs[Math.floor(Math.random() * msgs.length)];

      if (!prompt) {
         return sendMessage(id, { text: idid }, token);
      }

      const pi = { user: user.name.split(" ")[0], prompt: prompt }
      const api = "https://raaj-api.x10.bz/ai"

      try {
         const req = await axios.get(api, { params: pi });
         if (req.data.reply) {
            const msg = req.data.reply;
            return sendMessage(id, { text: msg }, token);
         } else if (req.data.error) {
            const msg = req.data.error;
            return sendMessage(id, { text: msg }, token);
         }
      } catch (error) {
          return sendMessage(id, { text: error }, token);
      }
   };
};

