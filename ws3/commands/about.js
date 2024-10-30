module.exports = {
  description: "What is WieAI?",
  async run({ api, send, admin }){
    await send({
      attachment: {
        type: "image",
        payload: {
          url: "https://i.imgur.com/gw1V46p.jpeg",
          is_reusable: true
        }
      }
    });
    setTimeout(async () => await send({
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `🤖 About WieAI:
WieAI is your friendly, helpful personal assistant.

💭 Why I named WieAI as a name of the page bot because this is dedicated to my girlfriend itself 👸

❓ Contact us admins if you experienced/encountered any issue regarding to the bot and I will try to fix it. Thankyou for using me as a personal assistant!`,
          buttons: [
            {
              type: "web_url",
              url: "https://www.facebook.com/profile.php?id=61566907376981",
              title: "Like/Follow our Page"
                },
            {
              type: "web_url",
              url: "https://www.facebook.com/kennethfranciscoaceberos",
              title: "Contact Admin 1"
                },
            {
              type: "web_url",
              url: "https://www.facebook.com/wieginesalpocialechavez",
              title: "Contact Admin 2"
                }
             ]
        }
      }
    }), 2*1000);
  }
}