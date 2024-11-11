module.exports = {
  name: 'gen',
  description: 'Send a funny dancing GIF',
  usage: 'gen',
  author: 'z3r0sec',

  async execute(senderId, sendMessage, args, pageAccessToken) {
    const prompt = args.join("+")
    const gifUrl = `https://joshweb.click/api/flux?prompt=${prompt}&model=4`;

    const attachment = {
      type: 'image',
      payload: { url: gifUrl }
    };
    sendMessage(senderId, { attachment }, pageAccessToken);
    sendMessage(senderId, { text: "Is This What You Were Looking For ?" }, pageAccessToken);
  }
};
