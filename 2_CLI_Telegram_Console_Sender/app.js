const { program } = require('commander');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')

process.env["NTBA_FIX_350"] = 1; // fix telegram-bot-api error while sending images

// bot logic
const token = '6240920072:AAEV0jAHUSmfMgdaECQeQOYRGG4YEYShvjQ';
const bot = new TelegramBot(token, {polling: true});

const chatID = fs.readFileSync("chat_id.txt", "utf8")

program.version('0.0.1')
// add commands to use app
program
.command('message <message>')
.alias('m')
.description('Send message to Telegram Bot')
.action((text) => {
    bot.sendMessage(chatID, text)
      .then(() => process.exit())
})

program
.command('photo <path>')
.alias('p')
.description('Send photo to Telegram Bot. Just drag and drop it into console after p-flag')
.action((path) => {
  console.log("you entered photo path: " + path)
  bot.sendPhoto(chatID, path)
    .then(() => process.exit())
})

program.parse(process.argv);

