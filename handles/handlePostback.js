const { sendMessage } = require('./sendMessage');

const handlePostback = async (event, pageAccessToken) => {
  const { id: senderId } = event.sender || {};
  const { payload } = event.postback || {};

  if (!senderId || !payload) return console.error('Invalid postback event object');

  try {
    // Prepare a button message
    const buttonMessage = {
      recipient: { id: senderId },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Welcome! How can I assist you today?",
            buttons: [
              {
                type: "postback",
                title: "Get Started",
                payload: "GET_STARTED"
              },
              {
                type: "web_url",
                url: "https://yourclothingstore.com",
                title: "Shop Now"
              }
            ]
          }
        }
      }
    };

    // Send the button message
    await sendMessage(senderId, { buttonMessage }, pageAccessToken);

  } catch (err) {
    console.error('Error sending postback response:', err.message || err);
  }
};

module.exports = { handlePostback };
