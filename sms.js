const sendSms = (message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  return client.messages.create({
    body: message,
    from: "+13217303849",
    to: "+12393130490",
  });
};

module.exports = sendSms;
