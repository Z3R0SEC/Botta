const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {
   name: 'filescan',
   description: 'Scan for exposed sensitive files on a website',   usage: 'filescan <url>',
   author: 'Mota - Dev',

   async execute(senderId, args, token) {                             
      const url = args[0];
      if (!url) {                                                        
         return sendMessage(senderId, { text: "Please provide a URL to scan for sensitive files (e.g., https://example.com)." }, token);                                                             
      }
                                                                      
      const sensitiveFiles = [
         ".env",
         "config.php",
         "backup.zip",
         ".git",
         ".htaccess",
         "wp-config.php",
      ];
      try {
         const results = [];
         for (const file of sensitiveFiles) {
            const testUrl = `${url}/${file}`;
            const response = await axios.get(testUrl);
            if (response.status === 200) {
               results.push(file);
            }
         }

         if (results.length > 0) {
            return sendMessage(senderId, { text: `Exposed Sensitive Files Detected:\n${results.join("\n")}` }, token);
         } else {
            return sendMessage(senderId, { text: "No sensitive files found." }, token);
         }
      } catch (error) {
         console.error("Error during sensitive file scan:", error);
         return sendMessage(senderId, { text: "Failed to scan for sensitive files. Please try again later." }, token);
      }
   }
};
