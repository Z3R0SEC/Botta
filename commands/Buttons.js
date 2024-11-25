const { sendMessage, sendButton } = require('../handles/sendMessage');

module.exports = {
  name: 'buttons',
  description: 'Send a message with buttons.',
  usage: 'buttons',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken) {

    try {
      await sendButton(senderId, "Choose an option:", [
  { type: "postback", title: "Commands", payload: "HELP" },
  { type: "postback", title: "About", payload: "ABOUT" },
  { type: "web_url", title: "Visit Website", url: "https://example.com" }
], pageAccessToken);
      
    } catch (error) {
      await sendMessage(senderId, { text: 'Failed to send buttons. Please try again later.'+error }, pageAccessToken);
      console.error('Error sending buttons:', error.message);
    }
  },
};
