const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'buttons',
  description: 'Send a message with buttons.',
  usage: 'buttons',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken) {
    const messageData = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'Welcome to the bot! Choose an option below:',
          buttons: [
            {
              type: 'postback',
              title: 'Commands',
              payload: 'HELP',
            },
            {
              type: 'postback',
              title: 'About',
              payload: 'ABOUT',
            },
            {
              type: 'postback',
              title: 'Prefix',
              payload: 'PREFIX',
            },
          ],
        },
      },
    };

    try {
      await sendMessage(senderId, messageData, pageAccessToken);
      await sendMessage(senderId, { messageData }, pageAccessToken);
    } catch (error) {
      await sendMessage(senderId, { text: 'Failed to send buttons. Please try again later.' }, pageAccessToken);
      console.error('Error sending buttons:', error.message);
    }
  },
};
