const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
   name: 'ai',
   description: 'Chat with an AI',
   usage: 'ai <message>',
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
      const fallbackMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

      // Send a fallback message if no prompt is provided
      if (!prompt) {
         return sendMessage(id, { text: fallbackMessage }, token);
      }

      // API parameters
      const apiParams = {
         user: user.name.split(" ")[0], // Use the first name of the user
         prompt: prompt
      };
      const apiUrl = "https://raaj-api.x10.bz/ai"; // External AI API endpoint

      try {
         // Make the API request
         const response = await axios.get(apiUrl, { params: apiParams });

         // Handle the response data
         if (response.data.reply) {
            return sendMessage(id, { text: response.data.reply }, token);
         } else if (response.data.error) {
            return sendMessage(id, { text: `Error: ${response.data.error}` }, token);
         } else {
            return sendMessage(id, { text: "Unexpected response from AI." }, token);
         }
      } catch (error) {
         // Log the error and send a message back to the user
         console.error('Error while communicating with AI API:', error);
         return sendMessage(id, { text: "An error occurred while processing your request. Please try again later." }, token);
      }
   }
};
