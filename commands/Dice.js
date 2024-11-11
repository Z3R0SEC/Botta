module.exports = {
  name: 'dice',
  description: 'Roll a dice',
  usage: 'diceroll',
  author: 'Thabani',

  async execute(senderId, sendMessage, args, pageAccessToken) {
    const result = Math.floor(Math.random() * 6) + 1;
    sendMessage(senderId, { text: `[»] Roll: ${result}!` }, pageAccessToken);
  }
};
