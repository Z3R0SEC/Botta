const axios=require("axios");
const {sendMessage}=require("../handles/sendMessage");

module.exports={name:"ai",description:"Chat with Me",usage:"ai <message>",author:"Mota Dev",

async execute(senderId,args,pageAccessToken,event){
const id=senderId;
const token=pageAccessToken;
const prompt=args.join(" ").trim();
const fallback=["Hi 😊","How can I help you today?","Anything else?","Do you need something? 🤭","Yoh, what's new?"][Math.floor(Math.random()*5)];

try{
let is_doc="text",file_url=null;
const attachment=event?.message?.attachments?.[0];

if(attachment){
if(!attachment.payload?.url)return sendMessage(id,{text:"Attachment Error: Missing URL"},token);
file_url=attachment.payload.url;
const typeMap={image:"img",audio:"aud",video:"vid",file:"doc"};
is_doc=typeMap[attachment.type]||"text";
}

if(!prompt&&!file_url)return sendMessage(id,{text:fallback},token);

let response;
try{
response=await axios.post("https://sb-ai-mdet.onrender.com/api/ai",{user:id,is_doc,prompt,file_url},{timeout:30000});
}catch(e){
return sendMessage(id,{text:"API Failed: "+(e.response?.data?.error?.message||e.message||"Unknown error")},token);
}

const res=response?.data;
if(!res)return sendMessage(id,{text:"API Error: Empty response"},token);
if(res.status!=="success")return sendMessage(id,{text:"API Error: "+(res?.error?.details||res?.error?.message||"Unknown error")},token);
if(!res?.data?.response)return sendMessage(id,{text:"API Error: Missing response"},token);

return sendMessage(id,{text:String(res.data.response)},token);

}catch(err){
return sendMessage(id,{text:"Bot Error: "+(err?.message||"Unknown error")},token);
}
}};
