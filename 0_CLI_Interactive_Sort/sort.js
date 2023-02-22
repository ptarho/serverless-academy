import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';



async function askForInput() {

    const rl = readline.createInterface({ input, output });
    const data = [] // user input data
    const answer = await rl.question('Hello enter 10 words or digits deviding them in space: '); // get user input
    data.push(...answer.split(' ')) // save it into array
    
    if (answer === 'exit') { 
        rl.close();
        return
    }else if (data.length < 2 || data.length > 10) { // check for correct input
        console.log("Invalid input, enter words in range from 2 to 10")
        rl.close();
        askForInput()
        return
    }
   
    const optionsString = `Chose an sort option: 
    a) Sort words alphabetically
    b) Show numbers from lesser to greater
    c) Show numbers from bigger to smaller
    d) Display words in ascending order by number of letters in the word
    e) Show only unique words
    f) Display only unique values from the set of words and numbers entered by the user

To exit the program, you need to enter "exit" 
    `;
    
    let option = await rl.question(optionsString);
    if (option === "exit") {
        rl.close();
        return
   }
    switch (option) { // to select an option user have to enter a letter
        case 'a':
            data.sort();
            console.log(data)
            break
        case 'b':
            console.log(data.filter(e => !isNaN(+e)).sort((a,b) => {
                if (a - b > 0) return 1
                else if (a - b < 0) return -1
                else return 0
            }))
            break
        case 'c':
            console.log(data.filter(e => !isNaN(+e)).sort((a,b) => {
                if (a - b > 0) return -1
                else if (a - b < 0) return 1
                else return 0
            }))
            break
        case 'd': 
            console.log(data.filter(e => isNaN(+e)).sort().sort((a,b) => {
                if (a.length > b.length) return 1
                else if (a.length < b.length) return -1
                else return 0
            }))
            break
        case 'e':
            let setOfWords = new Set(data.filter(e => isNaN(+e)));
            console.log([...setOfWords])
            break
        case 'f':
            let setAll = new Set(data);
            console.log([...setAll])
            break
    }
    rl.close()
    askForInput()
}

askForInput()