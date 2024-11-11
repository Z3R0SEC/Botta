module.exports = {
  name: 'uid',
  description: 'Retrieve the user’s unique Facebook ID',
  usage: 'uid',
  author: 'coffee',

  async execute(senderId, sendMessage, args, pageAccessToken) {
    sendMessage(senderId, { text: `${senderId}` }, pageAccessToken);
  }
};
