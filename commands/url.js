const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');
                                                           module.exports = {
   name: 'route',
   description: 'Perform a traceroute to a target',
   usage: 'route <target>',                                   author: 'Mota - Dev',
                                                              async execute(senderId, args, token) {
      const target = args[0];
      if (!target) {
         return sendMessage(senderId, { text: "Please provide a target to trace route (IP or domain)." }, token);
      }

      const apiUrl = `https://api.hackertarget.com/mtr/?q=${target}`;
      try {
         const response = await axios.get(apiUrl);
         const result = response.data || "Traceroute failed.";
         return sendMessage(senderId, { text: `Traceroute for ${target}:\n${result}` }, token);
      } catch (error) {
         console.error("Error during traceroute:", error);
         return sendMessage(senderId, { text: "Failed to perform traceroute. Try again later." }, token);
      }
   }
};
