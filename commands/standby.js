const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ai',
  description: 'Interact with GPT-4o',
  usage: 'gpt4 [your message]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Usage: ai <question>" }, pageAccessToken);

    try {
      const { reply } = await axios.get(`https://codetta.x10.bz/mvelo`, { params: { prompt: prompt, uid: "12345678987" } });
      console.log(`${reply}`);
      sendMessage(senderId, { text: reply }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'There was an error generating the content. Please try again later.' }, pageAccessToken);
    }
  }
