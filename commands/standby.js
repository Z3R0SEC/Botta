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

    const productKeywords = ['hoodie', 'tshirt', 'trouser', 'cap', 'hat', 'sweater'];
    const sizeKeywords = ['medium', 'large', 'small', 'xtra large', 'xtra small'];
    const quantityKeywords = ['one', 'two', 'three', '1', '2', '3'];
    const containsProduct = productKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    const containsSize = sizeKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    const containsQuantity = quantityKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    if (containsProduct && containsSize && containsQuantity) {
      const orderType = productKeywords.find(keyword => prompt.toLowerCase().includes(keyword));
      const sizeType = sizeKeywords.find(keyword => prompt.toLowerCase().includes(keyword));
      const quantity = quantityKeywords.find(keyword => prompt.toLowerCase().includes(keyword));

      const orderData = `Order: ${orderType} | Size: ${sizeType} | Quantity: ${quantity}`;

      try {
        const apiUrl = 'https://codetta.x10.bz/order';
        const userInfoUrl = `https://graph.facebook.com/${senderId}?fields=name&access_token=${pageAccessToken}`;
        const userInfoResponse = await axios.get(userInfoUrl);
        const username = userInfoResponse.data.name;
        const orderResponse = await axios.get(apiUrl, {
          params: {
            name: username,
            order: orderData
          }
        });

        return sendMessage(senderId, { text: `Thank you, ${username.split(" ")[0]}!\nYour order for a ${orderType} (Size: ${sizeType}, Quantity: ${quantity || "1"}) has been placed.\n\nWe will contact you shortly for your order confirmation.` }, pageAccessToken);
      } catch (error) {
        console.error('Error placing the order:', error);
        return sendMessage(senderId, { text: 'There was an error placing your order. We are aware of this issue and hope to get it fixed soon.' }, pageAccessToken);
      }
    }

    try {
      const response = await axios.get('https://codetta.x10.bz/mvelo', {
        params: { prompt: prompt, uid: senderId }
      });
      if (response.data.reply && !response.data.photos) {
         return sendMessage(senderId, { text: response.data.reply }, pageAccessToken);
      } else if (response.data.photos) {
         const selectedImages = response.data.photos.slice(0, 3);
         if (selectedImages.length === 0) {
             await sendMessage(senderId, { text: `Sorry, I couldn't find the photos you're looking for in our database!` }, pageAccessToken);
             return;
         }
         await sendMessage(senderId, { text: `Fetching your requested photos!` }, pageAccessToken);
         for (const url of selectedImages) {
             const attachment = {
               type: 'image',
               payload: { url }
             };
             await sendMessage(senderId, { attachment }, pageAccessToken);
         }
      }

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
};
