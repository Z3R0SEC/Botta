const { sendMessage } = require('../handles/sendMessage');

module.exports = {
    name: 'eval',
    description: 'Evaluate JavaScript code',
    usage: 'eval <code>',
    author: 'Mota - Dev',

    async execute(senderId, args, pageAccessToken) {
        const id = senderId;
        const token = pageAccessToken;

        if (!args.length) {
            return sendMessage(id, { text: 'Please provide code to evaluate!' }, token);
        }

        try {
            const code = args.join(' ');

            // Check if the code contains async/await, and handle accordingly
            let result;
            if (code.includes('await')) {
                result = await eval(`(async () => { return ${code}; })()`);
            } else {
                result = eval(`(function() { return ${code}; })()`);
            }

            if (typeof result === 'undefined') {
                result = 'undefined';
            } else if (result === null) {
                result = 'null';
            }

            return sendMessage(id, { text: `Result: ${result}` }, token);
        } catch (error) {
            return sendMessage(id, { text: `Error: ${error.message}` }, token);
        }
    }
};
