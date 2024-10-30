const axios = require("axios");
const name = "blackbox";

module.exports = {
  name,
  description: "Interact with Blackbox",
  async run ({ api, event, send, args }){
    const prompt = args.join(" ");
    if (!prompt) throw new Error(`Usage: ${api.prefix + name} [your question]`);
    try {
    send("Please wait... 🔎");
    const gpt = await axios.get(`${api.api_josh}/api/blackboxai`, {
      params: {
        q: prompt,
        uid: event.sender.id
      }
    });
    if (!gpt || !gpt.data.status) throw new Error();
    return send(`${gpt.data.result}

🤖 WieAI by Neth Aceberos`);
    } catch(err){
      send(err.message || err);
      return;
    }
  }
}