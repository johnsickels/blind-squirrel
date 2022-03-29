import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN);

export const sendTelegram = (message) => {
  const body = `${message.status}\n\n${message.title}\n\nPrice: ${message.price}\n\n${message.url}\n\nPosted: ${message.posted}`;
  return bot.sendMessage(-558012586, body);
};
