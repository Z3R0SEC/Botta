const { sendButton, sendMessage } = require('../handles/sendMessage'); // Add sendImage function
const axios = require('axios');

module.exports = {
   name: 'eval',
   description: 'Execute JavaScript code',
   usage: 'eval <code>',
   author: 'Mota - Dev',

   async execute(senderId, args, pageAccessToken, user) {
      const code = args.join(' '); // Combine args to form the code
      const id = senderId;
      const token = pageAccessToken;

      if (!code) {
         return sendMessage(id, { text: "Please provide JavaScript code to evaluate." }, token);
      }

      try {
         const result = eval(code); // Execute the JavaScript code
         return sendMessage(id, { text: `Result: ${result}` }, token);
      } catch (error) {
         console.error('Error while executing code:', error);
         return sendMessage(id, { text: `Error: ${error.message}` }, token);
      }
   }
};
