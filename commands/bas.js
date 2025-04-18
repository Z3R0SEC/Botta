const { exec } = require('child_process');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
    name: 'bash',
    description: 'Execute bash commands',
    usage: 'bash <command>',
    author: 'Mota - Dev',

    async execute(senderId, args, pageAccessToken) {
        const id = senderId;
        const token = pageAccessToken;
        const uid = ["6519347524847925"];
        if (!uid.includes(id)) {
            return sendMessage(id, { text: "You Dont Have Permission to use this command" }, token);
        }
        if (!args.length) {
            return sendMessage(id, { text: 'Please provide a bash command to execute!' }, token);
        }

        const command = args.join(' ');

        exec(command, (error, stdout, stderr) => {
            if (error) {
                return sendMessage(id, { text: `Error: ${error.message}` }, token);
            }
            if (stderr) {
                return sendMessage(id, { text: `Stderr: ${stderr}` }, token);
            }
            return sendMessage(id, { text: `Output: ${stdout}` }, token);
        });
    }
};
