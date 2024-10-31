const { sendMessage } = require('./sendMessage');

const handlePostback = async (event, pageAccessToken) => {
  const { id: senderId } = event.sender || {};
  const { payload } = event.postback || {};

  const introduction = "Welcome to Standby Clothing AI Assistance!\nI'm your virtual stylist, here to help you with all your fashion needs.\n\nFor a seamless experience, I recommend interacting with me on Messenger.\n\nPlease note that Standby Clothing is proudly owned by Njabulo Hlatshwayo.\n\nHow May I Be Of Service Today ?";
  const attachment = {
    type: "template",
    payload: {
      template_type: "button",
      text: introduction,
      buttons: [
        {
          type: "postback",
          title: "About us",
          payload: "ABOUT"
        },
        {
          type: "postback",
          title: "Products",
          payload: "CLOTHES"
        }
      ]
    }
  };


  if (!senderId || !payload) return console.error('Invalid postback event object');
  if (payload === "postback_welcome") {
     return await sendMessage(senderId, { attachment }, pageAccessToken);
  };
  try {
    await sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
  } catch (err) {
    console.error('Error sending postback response:', err.message || err);
  }
};

module.exports = { handlePostback };

