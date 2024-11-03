const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'orders',
  description: 'Retrieve user orders',
  usage: 'orders [all]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    // Define admin IDs
    const adminIds = ["100091064756375", "100071420738180"];
    const isAdmin = adminIds.includes(senderId);

    // Check if the user is requesting all orders and is an admin
    const isAllOrdersRequest = args.length > 0 && args[0].toLowerCase() === 'all';

    // Fetch the orders from the orders route API
    const apiUrl = `https://codetta.x10.bz/orders`;

    try {
      // Get username from the senderId (for non-admins)
      const userInfoUrl = `https://graph.facebook.com/${senderId}?fields=name&access_token=${pageAccessToken}`;
      const userInfoResponse = await axios.get(userInfoUrl);
      const username = userInfoResponse.data.name;

      const orderResponse = await axios.get(apiUrl);
      const orders = orderResponse.data;

      // If the request is for all orders and the user is an admin
      if (isAllOrdersRequest && isAdmin) {
        // Format all orders
        const formattedOrders = orders.map((order, index) => `${index + 1}. Order Details:\n${order.order}`).join('\n\n');
        return sendMessage(senderId, { text: `Here are all the orders:\n\n${formattedOrders}` }, pageAccessToken);
      }

      // For non-admins, filter orders based on the username
      const userOrders = orders.filter(order => order.name === username);

      // If no orders found, notify the user
      if (userOrders.length === 0) {
        return sendMessage(senderId, { text: `Hi ${username}, you don't have any orders yet.` }, pageAccessToken);
      }

      // Format the user's orders into a readable message
      const formattedUserOrders = userOrders.map((order, index) => `${index + 1}. ${order.order}`).join('\n');
      return sendMessage(senderId, { text: `Here are your orders, ${username}:\n\n${formattedUserOrders}` }, pageAccessToken);
    } catch (error) {
      // Handle errors gracefully
      return sendMessage(senderId, { text: 'There was an error retrieving the orders. Please try again later.' }, pageAccessToken);
    }
  }
};
