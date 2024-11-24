const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'cmd',
  description: 'Show help cmd menu',
  usage: 'cmd <cmd name>',
  author: 'Mota - Dev',


  execute(senderId, args, pageAccessToken, user) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    const name = user.name;

    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => {
      const command = require(path.join(commandsDir, file));
      return command.name.toLowerCase() === commandName;
      });

      if (commandFile) {
        const command = require(path.join(commandsDir, commandFile));
        const commandDetails = `
━━━━━━━━━━━━━━
[»] 𝙽𝚊𝚖𝚎: ‹ ${command.name} ›
[»] 𝙳𝚎𝚜𝚌: ‹ ${command.description} ›
[»] 𝚄𝚜𝚊𝚐𝚎: ‹ ${command.usage} ›
━━━━━━━━━━━━━━`;
        sendMessage(senderId, { text: commandDetails }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `Command ‹ ${commandName} › is not yet Available.` }, pageAccessToken);
      }
      return;
    }

    const commands = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return `│ › ${command.name}`;
    });

    const helpMessage = `
━━━━━━━━━━━━━━
 ^⁠_⁠^ ${name.spit(" ")[0]}
╭─╼━━━━━━━━╾─╮
${commands.join('\n')}
╰─━━━━━━━━━╾─╯
 (⁠θ⁠‿⁠θ⁠) V4.0 (⁠θ⁠‿⁠θ⁠)
━━━━━━━━━━━━━━`;

    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};
