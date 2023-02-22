import inquirer from "inquirer";
import fs from "fs";

// array of questions to add a user
const questions = [
  {
    type: "input",
    name: "name",
    message: "What's the user's name?",
  },
  {
    type: "list",
    name: "gender",
    message: "What's the user's gender?",
    choices: ["Male", "Female"],
  },
  {
    type: "input",
    name: "age",
    message: "What's the user's age?",
  },
];

async function addUser() {
  const answerName = await inquirer.prompt(questions[0]); // get user`s name
  if (!answerName.name) {
    return searchDB();
  }

  const answerGender = await inquirer.prompt(questions[1]); // get user`s gender

  let answerAge = await inquirer.prompt(questions[2]); // get user`s age
  while (isNaN(answerAge.age)) {
    console.log('Only numbers input is allowed!');
    answerAge = await inquirer.prompt(questions[2]);
  }
  if (!answerAge.age) { 
    fs.appendFileSync("db.txt", JSON.stringify({ ...answerName, ...answerGender }) + "\n") // save user info without age
    return addUser();
  }  

  fs.appendFileSync("db.txt", JSON.stringify({...answerName, ...answerGender, ...answerAge}) + "\n"); // save full info if age provided
  addUser();
}

async function searchDB() {
  const promt = await inquirer.prompt({
    type: "confirm",
    name: "search",
    message: "Would you to search values in DB?",
  });
  
  let dbContent = '';
  if (promt.search) {
    try {
      dbContent = fs.readFileSync("db.txt", "utf8"); // get all text data from db.txt file
    } catch(err) {
      console.log(`Can't read DB file ${err}`)
      return
    }
  
  const users = dbContent.split('\n').slice(0, -1).map(user => JSON.parse(user)); // transform text data into users array
  console.log(users);
  searchUser(users);
  }
}

async function searchUser(users) {
  const nameAnswer = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Enter user`s name you wanna find in DB:",
  });

  const foundUsers = users.filter(user => {
    return user.name.toLowerCase() === nameAnswer.name.toLowerCase() // find a user with selected name case insensitive
  }).map(e => JSON.stringify(e));

  if (foundUsers.length < 1) {
    console.log("No users found");
  } else if (foundUsers.length === 1) {
    console.log(`User ${nameAnswer.name} was found`)
    console.log(foundUsers[0]);
  } else {
    console.log(`Users ${nameAnswer.name} were found`)
    foundUsers.forEach(e => console.log(e))
  }
}

addUser()
