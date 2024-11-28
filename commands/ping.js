const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {
   name: 'ping',
   description: 'Ping a target to test connectivity',
   usage: 'ping <target>',
   author: 'Mota - Dev',

   async execute(senderId, args, token) {
      const target = args[0];
      if (!target) {
         return sendMessage(senderId, { text: "Please provide a target to ping (IP or domain)." }, token);
      }

      const apiUrl = `https://api.hackertarget.com/nping/?q=${target}`;
      try {
         const response = await axios.get(apiUrl);
         const result = response.data || "Ping test failed.";
         return sendMessage(senderId, { text: `Ping Result for ${target}:\n${result}` }, token);
      } catch (error) {
         console.error("Error during ping test:", error);
         return sendMessage(senderId, { text: "Failed to perform ping test. Try again later." }, token);
      }
   }
};
