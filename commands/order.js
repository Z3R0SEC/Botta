const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'order',
  description: 'Process clothing order',
  usage: 'order <item> <size>',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    // Join all the arguments into one string to check for keywords
    const prompt = args.join(' ').toLowerCase();
    
    // Check if any clothing item is mentioned
    const items = ['hoodie', 'tshirt', 'trouser', 'cap', 'hat', 'sweater'];
    const foundItem = items.find(item => prompt.includes(item));
    
    // If no item is found, prompt the user to select a valid item
    if (!foundItem) {
      return sendMessage(senderId, { text: "You have not selected a valid item. Please choose from: hoodie, tshirt, trouser, cap, hat, or sweater." }, pageAccessToken);
    }

    // Check for size keywords
    const sizes = ['small', 'medium', 'large', 'xtra large', 'xtra small'];
    let foundSize = sizes.find(size => prompt.includes(size));

    // If a size is mentioned, check if a number follows it (like "size 3" or "size 4")
    const sizeRegex = /size\s+(\d+)/i;
    const sizeMatch = prompt.match(sizeRegex);
    let customSize = null;

    if (sizeMatch) {
      customSize = sizeMatch[1]; // Grab the number after 'size'
    } else if (!foundSize) {
      // If no specific size is found, ask the user to select a size
      return sendMessage(senderId, { text: "Please select a size: small, medium, large, xtra large, or xtra small." }, pageAccessToken);
    }

    // At this point, both item and size are found, so construct the order data
    const orderSize = customSize ? `Size: ${customSize}` : `Size: ${foundSize}`;
    const orderData = `Order ${foundItem} // ${orderSize}`;

    // Use the Facebook Graph API to get the username
    const userInfoUrl = `https://graph.facebook.com/${senderId}?fields=name&access_token=${pageAccessToken}`;

    try {
      const userInfoResponse = await axios.get(userInfoUrl);
      const username = userInfoResponse.data.name;

      // Construct the GET request to your order API
      const apiUrl = `https://codetta.x10.bz/order`;
      const params = { name: username, order: orderData };

      await axios.get(apiUrl, { params });
      
      // Notify the user that their order was placed successfully
      return sendMessage(senderId, { text: `Thanks ${username}, your order for a ${foundItem} (${orderSize}) has been placed successfully!` }, pageAccessToken);
    } catch (error) {
      // Handle errors
      return sendMessage(senderId, { text: 'There was an error processing your order. Please try again later.' }, pageAccessToken);
    }
  }
};
