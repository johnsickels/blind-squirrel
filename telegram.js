import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN);

export const sendTelegram = (message) => {
  let body = `${message.status}\n\n${message.title}\n\nPrice: ${message.price}\n\nPosted: ${message.posted}`;
  body = body.replace(/\./g, "\\.");
  console.log(body);
  return bot.sendMessage(-558012586, body, { parse_mode: "MarkdownV2" });
};
