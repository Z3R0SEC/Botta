const { sendMessage } = require('./sendMessage');

const handlePostback = async (event, pageAccessToken) => {
  const { id: senderId } = event.sender || {};
  const { payload } = event.postback || {};

const getStarted = async (send) => send({
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: api.introduction,
      buttons: [
        {
          type: "postback",
          title: "Commands",
          payload: "HELP"
        },
        {
          type: "postback",
          title: "About",
          payload: "ABOUT"
        },
        {
          type: "postback",
          title: "Prefix",
          payload: "PREFIX"
        }
      ]
    }
  }
});
   const send = async text => sendMessage(senderID, typeof text === "object" ? text : { text }, pageAccessToken);

  if (!senderId || !payload) return console.error('Invalid postback event object');
  if (payload === "postback_welcome") {
     await getStarted(send);
  };
  try {

    await sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
  } catch (err) {
    console.error('Error sending postback response:', err.message || err);
  }
};

module.exports = { handlePostback };
