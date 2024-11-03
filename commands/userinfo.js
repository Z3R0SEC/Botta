const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'me',
  description: 'Retrieve your personal information',
  usage: 'me',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    try {
      // Fetch user info from Facebook Graph API
      const userInfoUrl = `https://graph.facebook.com/${senderId}?fields=id,name,email,gender,location,birthday&access_token=${pageAccessToken}`;
      const userInfoResponse = await axios.get(userInfoUrl);
      const userData = userInfoResponse.data;

      // Format the user information into a readable message
      const userInfoMessage = `
╔═════════════════╗
║  Your Information  ║
╚═════════════════╝
[ID] » ${userData.id}
[@] » ${userData.name}
[MAIL] » ${userData.email || 'N/A'}
[SEX] » ${userData.gender || 'N/A'}
[LOC] » ${userData.location ? userData.location.name : 'N/A'}
[BORN] » ${userData.birthday || 'N/A'}
      `;

      // Send the user information back to the user
      return sendMessage(senderId, { text: userInfoMessage }, pageAccessToken);
    } catch (error) {
      // Handle errors (e.g., if user data is unavailable)
      return sendMessage(senderId, { text: "There was an error retrieving your information. Please try again later." }, pageAccessToken);
    }
  }
};
