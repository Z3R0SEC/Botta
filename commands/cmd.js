const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const FormData = require('form-data');
const fs = require('fs');  // Assuming you'll store/retrieve the photo from your file system or another source

module.exports = {
  name: 'cmd',
  description: 'Admin commands',
  usage: 'cmd <total_commands|order_count|upload>',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken, attachmentUrl = null) {
    // Define admin IDs
    const adminIds = ["100091064756375", "100071420738180"];
    const isAdmin = adminIds.includes(senderId);

    // Check if the user is an admin
    if (!isAdmin) {
      return sendMessage(senderId, { text: "You do not have permission to use this command." }, pageAccessToken);
    }

    // If no arguments provided, return usage
    if (args.length === 0) {
      return sendMessage(senderId, { text: "Usage: cmd <total_commands|order_count|upload>" }, pageAccessToken);
    }

    const command = args[0].toLowerCase();

    try {
      // Handle total_commands command
      if (command === 'total_commands') {
        // Assuming you're tracking total number of commands somewhere
        const totalCommands = 42;  // Replace with your actual logic

        const message = `
╔════════════════════╗
║  Total Commands Run  ║
╚════════════════════╝
        ${totalCommands} commands have been executed.
        `;

        return sendMessage(senderId, { text: message }, pageAccessToken);
      }

      // Handle order_count command
      if (command === 'order_count') {
        const apiUrl = `https://codetta.x10.bz/order_count`;
        const orderCountResponse = await axios.get(apiUrl);
        const orderCount = orderCountResponse.data.orders_count;

        const message = `
╔══════════════════════════╗
║  Total Orders Placed      ║
╚══════════════════════════╝
        Orders: ${orderCount}
        `;

        return sendMessage(senderId, { text: message }, pageAccessToken);
      }

      // Handle upload command
      if (command === 'upload') {
        const category = args[1];

        if (!category) {
          return sendMessage(senderId, { text: "Please specify a category. Usage: cmd upload <category>" }, pageAccessToken);
        }

        if (!attachmentUrl) {
          return sendMessage(senderId, { text: "Please reply to a photo with this command to upload." }, pageAccessToken);
        }

        // Uploading the photo
        const uploadUrl = `https://codetta.x10.bz/upload`;
        const form = new FormData();

        // Fetch the image (or use local file handling, depends on your setup)
        const photoStream = await axios({
          url: attachmentUrl, // Get the attachment's URL
          method: 'GET',
          responseType: 'stream'
        });

        form.append('file', photoStream.data, { filename: 'upload.jpg' });
        form.append('category', category);

        const uploadResponse = await axios.post(uploadUrl, form, {
          headers: {
            ...form.getHeaders()
          }
        });

        if (uploadResponse.status === 200) {
          const message = `
╔══════════════════╗
║  Upload Success  ║
╚══════════════════╝
        The photo has been successfully uploaded to category: ${category}.
          `;
          return sendMessage(senderId, { text: message }, pageAccessToken);
        } else {
          return sendMessage(senderId, { text: "There was an error uploading the photo." }, pageAccessToken);
        }
      }

      // If the command is not recognized
      return sendMessage(senderId, { text: "Unknown command. Usage: cmd <total_commands|order_count|upload>" }, pageAccessToken);
    } catch (error) {
      // Handle any errors
      return sendMessage(senderId, { text: "There was an error processing your request. Please try again later." }, pageAccessToken);
    }
  }
};
