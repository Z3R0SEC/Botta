const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'prefix',
  description: 'See Bot Prefix',
  usage: 'prefix',
  author: 'Mota - Dev',

  async execute(senderId, args, pageAccessToken, user) {
     const photo = "https://www.pinterest.com/pin/791729168715206166/"
     const uid = senderId;
     const token = pageAccessToken;
     const attachment = {
        type: 'image',
        payload: { photo }
     };

     const msg = `
━━━━━━━━━━━━━━
ʘ⁠‿⁠ʘ Hi ${user.name.split(" ")[0] || "Friend"}
━━━━━━━━━━━━━━
› Prefix: 「 null 」
› Version: 「 V4.0 」
━━━━━━━━━━━━━━
≥ No Prefix
━━━━━━━━━━━━━━
`;

  try {
     await sendMessage(uid, { text: msg }, token);
     await sendMessage(uid, { attachment }, token);
  } catch (error) {
     await sendMessage(uid, { text: msg }, token);
     await sendMessage(uid, { attachment }, token)
  }
 }
};
