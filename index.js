#!/usr/bin/env node

const chalk = require('chalk'),
    inquirer = require('inquirer'),
    {
        generateId,
        folderInit,
        generateGPG,
        encryptStringWithRsaPublicKey,
        strSlicer, qr,
        generatePage,
        generateDecoder,
        createPDF
    } = require("./src/utils"),
    {
        regexConst,
        embed,
        textConst
    } = require("./src/constant")
require('clear')()

console.log(chalk.yellow(require('figlet').textSync(textConst.name))),
console.log(chalk.bgBlueBright.whiteBright.bold(textConst.welcome))

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: textConst.wizard.name,
        validate: (value) => value ? true : chalk.red(textConst.error.name)
    },
    {
        type: 'input',
        name: 'baseURL',
        message: textConst.wizard.url,
        validate: (value) => value.match(regexConst['External link']) ? true : chalk.red(textConst.error.url)
    },
    {
        type: 'input',
        name: 'riddles',
        message: textConst.wizard.steps,
        validate: (value) => value.match(regexConst.int) ? true : chalk.red(textConst.error.int)
    }])
    .then(async answers => {
        const riddles = {}
        const ask = async (num, format, regEx) =>
            await inquirer.prompt({
                type: 'input',
                name: 'question',
                format: {
                    'Text': 'text', 'External link': 'extlink',
                    'YouTube': 'youtube', 'Image': 'img'
                }[format],
                message: `Hint #${num}:`,
                validate: (value) => value.match(regEx) ? true : chalk.red(textConst.error.input)
            }).then(val =>
                Object.assign(val, {format: format, name: generateId()}))
        for (let i = 0; i < parseInt(answers.riddles); i += 1) {
            const riddle = await inquirer.prompt({
                type: 'list',
                name: 'type',
                message: textConst.wizard.hintType,
                choices: ['Text', 'External link', 'YouTube', 'Image'],
            }).then(async typeOfRiddle => {
                console.log(textConst.typeOfRiddle[typeOfRiddle.type])
                return await ask(i + 1, typeOfRiddle.type, regexConst[typeOfRiddle.type])
            })
            riddles[riddle.name] = {value: riddle.question, format: riddle.format}
        }
        return Object.assign(answers, {
            riddles: Object.assign(riddles, await inquirer.prompt({
                type: 'input',
                name: `fin_${generateId()}`,
                message: textConst.wizard.lastHint,
                validate: (value) => value ? true : chalk.red(textConst.error.noText)
            }))
        })
    })
    .then(async output => {
        folderInit(Object.keys(output.riddles))
        const baseURL = output.baseURL.endsWith('/') ? output.baseURL : `${output.baseURL}/`
        const keysNames = {public: generateId(12), private: generateId(12)}
        const keys = await generateGPG(keysNames.public, keysNames.private)
        const finalId = Object.keys(output.riddles).find(i => i.startsWith('fin_'))
        const finalEncSplit = strSlicer(encryptStringWithRsaPublicKey(output.riddles[finalId], keysNames.public),
            Object.keys(output.riddles).length)
        const qrCodes = [],
            finalObj = [];
        for (let i = 0; i < Object.keys(output.riddles).length; i += 1) {
            const id = Object.keys(output.riddles)[i]
            if (i === Object.keys(output.riddles).length-1){
                const decoderId = generateId()
                folderInit([decoderId])
                generateDecoder(output.name,decoderId) //TODO: remove this init and make the id creation in the index header.
                await qrCodes.push(qr(`${baseURL}${id}`).then(async qrImg => {
                        await generatePage(output.name, id, finalEncSplit[i],
                            qrImg, i + 1, Object.keys(output.riddles).length,
                            false, {url:`${baseURL}keys/${keysNames.private}.key`,decoder:`${baseURL}${decoderId}`})
                        return qrImg
                    }
                ))
            } else{
                await qrCodes.push(qr(`${baseURL}${id}`).then(async qrImg => {
                        await generatePage(output.name, id, finalEncSplit[i],
                            qrImg, i + 1, Object.keys(output.riddles).length,
                            embed[output.riddles[id].format](output.riddles[id].value),)
                        return qrImg
                    }
                ))
            }
        }
        await Promise.all(qrCodes)
        for (id in qrCodes)
            finalObj.push({'id': id, 'qr': qrCodes[id]});
        createPDF(finalObj)
        textConst.finale.forEach(msg => console.log(chalk.green.bold(msg)))
    })

