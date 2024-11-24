const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'buttons',
  description: 'Send a message with buttons.',
  usage: 'buttons',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken) {
    const buttons = [
      { type: 'postback', title: 'Option 1', payload: 'BUTTON_1' },
      { type: 'postback', title: 'Option 2', payload: 'BUTTON_2' },
      { type: 'web_url', title: 'Visit Website', url: 'https://example.com' },
      { type: 'postback', title: 'Help', payload: 'HELP' },
    ];

    const messageData = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'Choose an option:',
          buttons: buttons,
        },
      },
    };

    try {
      await sendMessage(senderId, messageData, pageAccessToken);
      await sendMessage(senderId, { messageData }, pageAccessToken);
    } catch (error) {
      await sendMessage(senderId, { text: 'Failed to send buttons. Please try again later.' }, pageAccessToken);
    }
  },
};
