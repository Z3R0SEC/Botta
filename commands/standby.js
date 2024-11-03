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
    const sizeKeywords = ['medium', 'large', 'small', 'xtra large', 'xtra small'];
    const quantityKeywords = ['one', 'two', 'three', '1', '2', '3'];  // optional

    // Check if the message contains product, size, and (optional) quantity keywords
    const containsProduct = productKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    const containsSize = sizeKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    const containsQuantity = quantityKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    // If the message contains all three keywords, handle the order
    if (containsProduct && containsSize && containsQuantity) {
      const orderType = productKeywords.find(keyword => prompt.toLowerCase().includes(keyword));
      const sizeType = sizeKeywords.find(keyword => prompt.toLowerCase().includes(keyword));
      const quantity = quantityKeywords.find(keyword => prompt.toLowerCase().includes(keyword));

      const orderData = `Order: ${orderType} | Size: ${sizeType} | Quantity: ${quantity}`;

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
        return sendMessage(senderId, { text: `Thank you, ${username}! Your order for a ${orderType} (Size: ${sizeType}, Quantity: ${quantity}) has been placed.` }, pageAccessToken);
      } catch (error) {
        console.error('Error placing the order:', error);
        return sendMessage(senderId, { text: 'There was an error placing your order. Please try again later.' }, pageAccessToken);
      }
    }

    // If all three keywords are NOT present, fallback to AI response
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
