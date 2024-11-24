const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'uid',
  description: 'get user ID',
  usage: 'uid',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken) {
      sendMessage(senderId, { text: `‹ ${senderId} ›` }, pageAccessToken);
  }
};
