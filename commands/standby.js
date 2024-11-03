const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interact with GPT-4 and handle orders',
  usage: 'ai [your message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, { text: "Usage: ai <question>" }, pageAccessToken);
    }

    // Define keywords for identifying orders
    const productKeywords = ['hoodie', 'tshirt', 'trouser', 'cap', 'hat', 'sweater'];
    const sizeKeywords = ['size', 'medium', 'large', 'small', 'xtra large', 'xtra small'];

    // Check if the prompt contains any product keywords
    const containsProduct = productKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    const containsSize = sizeKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    // If the message contains a product keyword, but no size or details, prompt the user for more info
    if (containsProduct && !containsSize) {
      return sendMessage(senderId, { text: "Please provide the size (e.g., medium, large, xtra large) for your order." }, pageAccessToken);
    }

    // If both product and size are mentioned, handle the order
    if (containsProduct && containsSize) {
      const orderType = productKeywords.find(keyword => prompt.toLowerCase().includes(keyword));
      const sizeType = sizeKeywords.find(keyword => prompt.toLowerCase().includes(keyword));

      const orderData = `Order: ${orderType} | Size: ${sizeType}`;

      // Send order to the API
      try {
        const apiUrl = 'https://codetta.x10.bz/order';
        const userInfoUrl = `https://graph.facebook.com/${senderId}?fields=name&access_token=${pageAccessToken}`;

        // Fetch the user's name from Facebook Graph API
        const userInfoResponse = await axios.get(userInfoUrl);
        const username = userInfoResponse.data.name;

        // Send the order with the user's info to the order API
        const orderResponse = await axios.get(apiUrl, {
          params: {
            name: username,
            order: orderData
          }
        });

        // Confirm the order to the user
        return sendMessage(senderId, { text: `Thank you, ${username}! Your order for a ${orderType} (Size: ${sizeType}) has been placed.` }, pageAccessToken);
      } catch (error) {
        console.error('Error placing the order:', error);
        return sendMessage(senderId, { text: 'There was an error placing your order. Please try again later.' }, pageAccessToken);
      }
    }

    // If no product keywords are detected, fall back to regular AI (GPT-4) processing
    try {
      const response = await axios.get('https://codetta.x10.bz/mvelo', {
        params: { prompt: prompt, uid: senderId }
      });
      const reply = response.data.reply;
      console.log(reply);
      sendMessage(senderId, { text: reply }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching the GPT-4 response:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
