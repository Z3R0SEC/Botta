const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
   name: 'raaj',
   description: 'Chat with RaaJ',
   usage: '<message>',
   author: 'Mota - Dev',

   async execute(senderId, args, pageAccessToken, user) {
      const prompt = args.join(' '); // Combine args to form the user message
      const id = senderId;
      const token = pageAccessToken;

      // Default fallback messages
      const defaultMessages = [
         "Yo, Sup?",
         "Yo, What's the Word?",
         "Need Something?",
         "Listening...",
         "What's New Dude?"
      ];
      const fallbackMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

      // If no prompt is provided, send a fallback message
      if (!prompt) {
         return sendMessage(id, { text: fallbackMessage }, token);
      }

      // Prepare API parameters
      const apiParams = {
         user: id, // Extract the first name of the user
         prompt: prompt
      };
      const apiUrl = "https://mota-api.x10.bz/api/ai"; // RaaJ AI API endpoint

      try {
         // Make the API call
         const response = await axios.get(apiUrl, { params: apiParams });

         // Handle the API response
         if (response.data.reply) {
            return sendMessage(id, { text: response.data.reply }, token);
         } else if (response.data.error) {
            return sendMessage(id, { text: `Error: ${response.data.error}` }, token);
         } else {
            return sendMessage(id, { text: "Unexpected response from RaaJ AI." }, token);
         }
      } catch (error) {
         // Log the error and notify the user
         console.error('Error while communicating with RaaJ API:', error.message || error);
         return sendMessage(
            id,
            { text: "An error occurred while connecting to RaaJ. Please try again later." },
            token
         );
      }
   }
};
