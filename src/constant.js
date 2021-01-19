module.exports = {
    conf: {
        gpg: {
            type: 'rsa',
            options: {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            }
        }
    },
    regexConst: {
        any: /.*/,
        int: /^[0-9]*$/i,
        'Text': /.*/,
        'External link': /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
        'Image': /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/,
        'YouTube': /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
    },
    embed: {
        'YouTube': (url) => `<iframe width="420" height="345" src="${url}"></iframe>`,
        'Image': (url) => `<img width="420" src="${url}"/>`,
        'External link': (url) => `<a href="${url}">${url}</a>`,
        'Text': (text) => `<h5>${text}</h5>`
    },
    textConst: {
        name: 'EscapeRoomGenerator!',
        welcome: 'Welcome to Escape Room Generator\nMake the best out of COVID19 and surprise your housemate/lover/dog!',
        wizard: {
            name: 'Give your escape room a snappy name:',
            url: `What's the base URL you gonna use for this online experience (soon gonna auto upload to firebase).`,
            steps: 'How many steps would you like to generate (number of riddles)',
            hintType: 'Select the type of hint',
            lastHint: 'Money time! Give the last hint to where you hid your present'
        },
        error: {
            name: 'Please enter a name!',
            url: 'Please enter a valid URL!',
            int: 'Please enter a valid number!',
            input: 'Invalid input!',
            noText: 'No text'
        },
        typeOfRiddle: {
            'Text': 'Free string, you can type any clue you want in UTF8',
            'External link': 'Use a valid hyperlink and send them to a quest',
            'YouTube': 'Let them watch something',
            'Image': 'All image format supported'
        },
        finale: ['Mazal tof! check your /public folder for the your indoor escape room!',
            'In addition, we included the GPG keys used to encode the final message + a pdf file with all the QR codes for you to hide around the house!']
    }
}