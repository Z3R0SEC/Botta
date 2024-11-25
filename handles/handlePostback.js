const { sendMessage, sendButton } = require('./sendMessage');

const handlePostback = async (event, pageAccessToken) => {
  const { id: senderId } = event.sender || {};
  const { payload } = event.postback || {};

  if (!senderId || !payload) {
    return console.error('Invalid postback event object');
  }

  try {
    if (payload === "HELP") {
      await sendButton(senderId, "To View Commands Or Get Command List Please Type: cmd", [ {"type": "phone_number", "title": "Call Me", "payload": "+27847611848"} ], pageAccessToken);
    } else if (payload === "ABOUT") {
      await sendButton(senderId, "Hi, Thanks For Your Interest In Knowing My Dev!\n\nPlease Click Any Button Below To know More About Me", [ {"type": "web_url", "title": "Facebook", "url": "https://www.facebook.com/profile.php?id=100091064756375"}, {"type": "web_url", "title": "Whatsapp", "url": "https://wa.me/+27847611848"} ], pageAccessToken);
    } else {
      await sendButton(senderId, "Hello, ‹ Friend ›🙂❤️\n\nThank You For Reaching Out To My ChatBot\nNOTE:.\n\n› Works Better On Messenger\n›Improvement And More Features To Come.\n\nClick Below Button To Learn More About me!\n", [ {"type": "web_url", "title": "Fund Me", "url": "https://pay.capitecbank.co.za/payme/ZST5XN"}, {"type": "web_url", "title": "RaaJ Ai Api", "url": "https/raaj-api.x10.bz/"}, {"type": "web_url", "title": "Whatsapp Us", "url": "https://wa.me/+27847611848"}, {"type": "web_url", "title": "Admin FB", "url": "https://www.facebook.com/profile.php?id=100091064756375"} ], pageAccessToken);
      await sendMessage(senderId, { text: `You clicked: ${payload}` }, pageAccessToken);
    }
  } catch (err) {
    console.error('Error sending postback response:', err.message || err);
  }
};

module.exports = { handlePostback };
