const chalk = require('chalk'),
    inquirer = require('inquirer'),
    {
        generateId,
        folderInit,
        generateGPG,
        encryptStringWithRsaPublicKey,
        strSlicer,
        qr,
        generatePage
    } = require("./src/utils");
require('clear')()
console.log(
    chalk.yellow(
        require('figlet').textSync('EscapeRoomGenerator!',)
    )
);
console.log(chalk.bgBlueBright.whiteBright.bold('Welcome to Escape Room Generator\nMake the best out of COVID19 and surprise your housemate/lover/dog!'))

if (process.env.NODE_ENV) {
    const output = {
        name: 'demo 321',
        baseURL: 'http://www.kekeke.net/',
        riddles: { //Made up hint to the first one
            '9d4f6a44d190fc5f': 'eifo ze',
            '4da5ef350f91c238': 'ze po?',
            '4ebf3767db2a6e7b': 'lama ?',
            'fin_36a0d89f033b952f': 'kol hakavod'
        }
    }
    //STARTS CUT HERE
    folderInit(Object.keys(output.riddles).filter(id => !id.startsWith('fin_')))
    const baseURL = output.baseURL.endsWith('/') ? output.baseURL : `${output.baseURL}/`
    const keys = generateGPG()
    const finalId = Object.keys(output.riddles).find(i => i.startsWith('fin_'))
    const finalEncSplit = strSlicer(encryptStringWithRsaPublicKey(output.riddles[finalId]), Object.keys(output.riddles).length - 1)
    const qrCodes = []
    for (let i = 0; i < Object.keys(output.riddles).length - 1; i += 1) {
        const id = Object.keys(output.riddles)[i]
        qrCodes.push(qr(`${baseURL}${id}`).then(qrImg => {
                generatePage(output.name, id, finalEncSplit[i], output.riddles[id], qrImg)
                return qrImg
            }
        ))
    }
    // await Promise.all(qrCodes)
    // TILL HERE
} else {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Give your escape room a snappy name:',
            validate: (value) => value ? true : chalk.red('Please enter a name!')
        },
        {
            type: 'input',
            name: 'baseURL',
            message: `What's the base URL you gonna use for this online experience (soon gonna auto upload to firebase).`,
            validate: (value) => value.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/) ? true : chalk.red('Please enter a valid URL!')
        },
        {
            type: 'input',
            name: 'riddles',
            message: "How many steps would you like to generate (number of riddles)",
            validate: (value) => value.match(/^[0-9]*$/i) ? true : chalk.red('Please enter a valid number!')
        }])
        .then(async answers => {
            const questions = []
            for (let i = 0; i < parseInt(answers.riddles); i += 1) {
                questions.push({
                    type: 'input',
                    name: generateId(),
                    message: `Question ${i + 1}:`,
                    validate: (value) => value ? true : chalk.red('No text')
                });
            }
            questions.push({
                type: 'input',
                name: `fin_generateId()`,
                message: `Money time! Give the last hint to where you hid your present`,
                validate: (value) => value ? true : chalk.red('No text')
            })
            return Object.assign(answers, {riddles: await inquirer.prompt(questions)})
        }).then(async output => {


        // HERE!
        folderInit(Object.keys(output.riddles).filter(id => !id.startsWith('fin_')))
        const baseURL = output.baseURL.endsWith('/') ? output.baseURL : `${output.baseURL}/`
        const keys = generateGPG()
        const finalId = Object.keys(output.riddles).find(i => i.startsWith('fin_'))
        const finalEncSplit = strSlicer(encryptStringWithRsaPublicKey(output.riddles[finalId]), Object.keys(output.riddles).length - 1)
        const qrCodes = []
        for (let i = 0; i < Object.keys(output.riddles).length - 1; i += 1) {
            const id = Object.keys(output.riddles)[i]
            qrCodes.push(qr(`${baseURL}${id}`).then(qrImg => {
                    generatePage(output.name, id, finalEncSplit[i], output.riddles[id], qrImg, i + 1, Object.keys(output.riddles).length - 1)
                    return qrImg
                }
            ))
        }
        await Promise.all(qrCodes)
        console.log(chalk.green.bold('Mazal tof! check your /public folder for the your indoor escape room!'))
        console.log('In addition, we included the GPG keys used to encode the final message + a pdf file with all the QR codes for you to hide around the house!')
    })
}
