import twilio from "twilio";

export const sendSms = (message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const body = `\n\nNew Listing\n\n${message.title}\n\nPrice: ${message.price}\n\n${message.url}`;

  console.log("sending text");

  return Promise.all([
    client.messages.create({
      body,
      from: "+13217303849",
      to: "+12393130490",
    }),
    client.messages.create({
      body,
      from: "+13217303849",
      to: "+19032584132",
    }),
  ]);
};
