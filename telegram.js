import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN);

export const sendTelegram = (message) => {
  const body = `\n\nNew Listing\n\n${message.title}\n\nPrice: ${message.price}\n\n${message.url}`;

  return bot.sendMessage(5119416758, body);
};