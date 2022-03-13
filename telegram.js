import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN);

export const sendTelegram = (msg) => {
  return bot.sendMessage(5119416758, msg);
};
