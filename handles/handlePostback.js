const { sendMessage } = require('./sendMessage');
const { handleMessage } = require('./handleMessage');  // Import the handleMessage function for command execution

const handlePostback = async (event, pageAccessToken) => {
  const { id: senderId } = event.sender || {};
  const { payload } = event.postback || {};

  if (!senderId || !payload) {
    console.error('Invalid postback event object');
    return;
  }

  try {
    // Handle the postback based on payload
    switch (payload) {
      case 'HELP':
        // Execute the 'cmd' command or any other command you want when 'HELP' is triggered
        await handleMessage({ sender: { id: senderId }, message: { text: '-cmd' } }, pageAccessToken);
        break;

      case 'ABOUT':
        // Execute the 'about' command or any other command for the 'ABOUT' payload
        await handleMessage({ sender: { id: senderId }, message: { text: '-about' } }, pageAccessToken);
        break;

      case 'PREFIX':
        // Execute the 'prefix' command or any other command for the 'PREFIX' payload
        await handleMessage({ sender: { id: senderId }, message: { text: '-prefix' } }, pageAccessToken);
        break;

      default:
        await sendMessage(senderId, { text: `Unknown command: ${payload}` }, pageAccessToken);
    }
  } catch (err) {
    console.error('Error sending postback response:', err.message || err);
    await sendMessage(senderId, { text: 'There was an error processing your request.' }, pageAccessToken);
  }
};

module.exports = { handlePostback };
