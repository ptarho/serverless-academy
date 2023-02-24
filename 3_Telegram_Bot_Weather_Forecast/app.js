const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const botConfig = require("./botConfig");
const apiKey = process.env.apiKey;
const botToken = process.env.botToken;
const bot = new TelegramBot(botToken, { polling: true });

function botLogic(cbForecast) {
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hello dear user", 
    botConfig.back.keyboard);
  });

  bot.on("message", async(msg) => {
    const msgText = msg.text.toLowerCase();
    let match = msgText.match(/every\s+(\d+)\s+hours/i); // match message with `every x hours`

    if (match) { // handle 
      let interval = +match[1];
      let forecastMsg = checkInterval(interval) ? await cbForecast(interval) : `Please enter valid interval`;
      bot.sendMessage(msg.chat.id,`${forecastMsg}`,
        botConfig.forecast.keyboard
      );
    } else if (!botConfig[msgText]) {
      bot.sendMessage(msg.chat.id, 
        botConfig.default.message, 
        botConfig.default.keyboard);
    } else {
      bot.sendMessage(msg.chat.id, 
        botConfig[msgText].message,
        botConfig[msgText].keyboard,
      );
    } 

  });

};

function checkInterval(interval) {
  return [3,6].includes(interval)
}

function forecast(interval) {
  return new Promise((resolve, reject) => {
    if (interval !== 3 && interval !== 6) {
      resolve('Please enter valid time interval')
    }
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Lviv&units=metric&appid=${apiKey}`)
    .then(response => {
      let list = response.data.list;
      let message = ``;

      list.forEach((e, idx) => {
        let date = new Date(e.dt * 1000);
        let timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        let dayNum = date.getDate();
        let prevDayNum = idx > 0 ? new Date(list[idx - 1].dt * 1000).getDate() : dayNum;
        let {temp, feels_like} = e.main;
        let {description} = e.weather[0];

        if (idx === 0) {
          message += `Weather in Lviv:`;
        }
        if (idx === 0 || dayNum !== prevDayNum) {
          let dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
          message += `\n\n${dateString}`;
        } 

        if (interval === 6 && !(idx % 2)) {
          message +=`\n  ${timeString}, ${temp}°C, feels like ${feels_like}°C, ${description}`;
        } else if (interval === 3) {
          message +=`\n  ${timeString}, ${temp}°C, feels like ${feels_like}°C, ${description}`;
        }
        
      });
      console.log(message);
      resolve(message)
    })
    .catch(error => {
      reject(error)
    })
  })
}
//forecast(6)
botLogic(forecast);

