import twilio from "twilio";

export const sendSms = (message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  console.log("sending text");
  return client.messages.create({
    body: JSON.stringify(message),
    from: "+13217303849",
    to: "+12393130490",
  });
};
