const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {
   name: 'subdomain',
   description: 'Fi6nd subdomains of a target domain',
   usage: 'subdomain <domain>',
   author: 'Mota - Dev',

   async execute(senderId, args, token) {
      const domain = args[0];
      if (!domain) {
         return sendMessage(senderId, { text: "Please provide a domain to enumerate subdomains." }, token);
      }

      const apiUrl = `https://sonar.omnisint.io/subdomains/${domain}`;
      try {
         const response = await axios.get(apiUrl);
         const subdomains = response.data || [];
         if (subdomains.length > 0) {
            return sendMessage(senderId, { text: `Subdomains for ${domain}:\n${subdomains.join('\n')}` }, token);
         } else {
            return sendMessage(senderId, { text: "No subdomains found." }, token);
         }
      } catch (error) {
         console.error("Error while retrieving subdomains:", error);
         return sendMessage(senderId, { text: "Failed to enumerate subdomains. Please try again later." }, token);
      }
   }
};
