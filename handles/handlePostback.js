const { sendMessage } = require('./sendMessage');

const handlePostback = async (event, pageAccessToken) => {
  const { id: senderId } = event.sender || {};
  const { payload } = event.postback || {};

  if (!senderId || !payload) {
    return console.error('Invalid postback event object');
  }

  try {
    if (payload === "HELP") {
      await sendMessage(senderId, { text: "Here are your commands..." }, pageAccessToken);
    } else if (payload === "ABOUT") {
      await sendMessage(senderId, { text: "This is a bot created by Mota-Dev." }, pageAccessToken);
    } else {
      await sendMessage(senderId, { text: `You clicked: ${payload}` }, pageAccessToken);
    }
  } catch (err) {
    console.error('Error sending postback response:', err.message || err);
  }
};

module.exports = { handlePostback };
