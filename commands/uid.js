const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'uid',
  description: 'Retrieve the user’s unique Facebook ID',
  usage: 'uid',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    sendMessage(senderId, { text: `${senderId}` }, pageAccessToken);
  }
};
