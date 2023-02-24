const botConfig = {
  forecast: {
    message: 'Choose an option',
    keyboard: {
      reply_markup: {
        keyboard: [
          ["Every 3 hours", "Every 6 hours"], 
          ["Back"]
        ],
      },
    }
  },
  back: {
    message: 'Would you like to check weather forecast in Lviv?',
    keyboard: {
      reply_markup: {
        keyboard: [["Forecast"]],
      }
    }
  },
  default: {
    message: 'Sorry, I don`t understand. Can you choose an option?',
    keyboard: {
      reply_markup: {
        keyboard: [
          ["Every 3 hours", "Every 6 hours"], 
          ["Back"]
        ],
      },
    }
  }
}

module.exports = botConfig;