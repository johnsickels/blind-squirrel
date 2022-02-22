import twilio from "twilio";

export const sendSms = (message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  const body = `New Listing
  
  ${message.title}

  Price: ${message.price}

  ${message.url}
  `;

  console.log("sending text");

  return client.messages.create({
    body,
    from: "+13217303849",
    to: "+12393130490",
  });
};
