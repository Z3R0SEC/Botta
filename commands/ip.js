const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {
    name: 'ipinfo',
    description: 'Get detailed information about an IP address or detect attachments',
    usage: 'ipinfo <ip>',
    author: 'Mota - Dev',

    async execute(senderId, args, token, event) {

        // 🌝 1. FULL EVENT JSON
        const fullEvent = JSON.stringify(event, null, 2);

        // 📎 2. ATTACHMENT DETECTION
        if (event?.message?.attachments) {
            const attachments = event.message.attachments;

            const fileUrls = attachments.map((file, index) => {
                return `File ${index + 1}\nType: ${file.type}\nURL: ${file.payload.url}`;
            }).join('\n\n');

            return sendMessage(senderId, {
                text: `📎 Attachments Received:\n\n${fileUrls}\n\n🌝 Full Event JSON:\n\n${fullEvent}`
            }, token);
        }

        // 🧠 3. NORMAL IPINFO COMMAND
        const ip = args[0];
        if (!ip) {
            return sendMessage(senderId, { text: "Please provide an IP address." }, token);
        }

        const apiUrl = `http://ip-api.com/json/${ip}`;

        try {
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data.status === "success") {
                return sendMessage(senderId, {
                    text: `🌍 IP Info for ${ip}:\n\nCountry: ${data.country}\nRegion: ${data.regionName}\nCity: ${data.city}\nISP: ${data.isp}\nOrganization: ${data.org}`
                }, token);
            } else {
                return sendMessage(senderId, { text: "Failed to retrieve IP information." }, token);
            }
        } catch (error) {
            console.error("Error during IP info retrieval:", error);
            return sendMessage(senderId, { text: "Failed to retrieve IP information. Try again later." }, token);
        }
    }
};
