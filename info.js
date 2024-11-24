const msg = `
━━━━ ‹ admin › ━━━━
━━━━━━━━━━━━━
[≥] Thabani
[≥] Mota
[≥] Z3R0SEC

━━━ ‹ donate › ━━━
━━━━━━━━━━━━
[›] Bank: Capitec
[›] PayTo: 0847611848
[›] Ref: Donation
[›] Minimum: R10
━━━━━━━━━━━━━
`;

const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'info',
  description: 'Get Admin Info',
  usage: 'info',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, user) {
      const reply = async (text) = {
           await sendMessage(senderId, { text: text }, pageAccessToken);
      };

      reply(msg);
  }
};

