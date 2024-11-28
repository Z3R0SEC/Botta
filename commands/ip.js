const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {                                            name: 'ipinfo',
   description: 'Get detailed information about an IP address',
   usage: 'ipinfo <ip>',
   author: 'Mota - Dev',

   async execute(senderId, args, token) {                        const ip = args[0];                                        if (!ip) {
         return sendMessage(senderId, { text: "Please provide an IP address." }, token);
      }                                                    
      const apiUrl = `http://ip-api.com/json/${ip}`;
      try {
         const response = await axios.get(apiUrl);                  const data = response.data;
                                                                    if (data.status === "success") {
            return sendMessage(senderId, {
               text: `IP Info for ${ip}:\nCountry: ${data.country}\nRegion: ${data.regionName}\nCity: ${data.city}\nISP: ${data.isp}\nOrganization: ${data.org}`
            }, token);
         } else {
            return sendMessage(senderId, { text: "Failed to retrieve IP information." }, token);
         }
      } catch (error) {
         console.error("Error during IP info retrieval:", error);
         return sendMessage(senderId, { text: "Failed to retrieve IP information. Try again later." }, token);
      }
   }
};
