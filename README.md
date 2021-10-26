```
  _____                          ____                        ____                           _             _
 | ____|___  ___ __ _ _ __   ___|  _ \ ___   ___  _ __ ___  / ___| ___ _ __   ___ _ __ __ _| |_ ___  _ __| |
 |  _| / __|/ __/ _` | '_ \ / _ \ |_) / _ \ / _ \| '_ ` _ \| |  _ / _ \ '_ \ / _ \ '__/ _` | __/ _ \| '__| |
 | |___\__ \ (_| (_| | |_) |  __/  _ < (_) | (_) | | | | | | |_| |  __/ | | |  __/ | | (_| | || (_) | |  |_|
 |_____|___/\___\__,_| .__/ \___|_| \_\___/ \___/|_| |_| |_|\____|\___|_| |_|\___|_|  \__,_|\__\___/|_|  (_)
                     |_|
```
---
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]

The first indoor escape room generator!

Send your beloved partner\roomate\dog\bff to a COVID-19 style adventure around the house!

<sup>[It all started with a friend's idea](https://www.linkedin.com/posts/konradgreilich_opensource-escaperooms-encryption-activity-6759800549572395009-zVNl
)
<3</sup>

---



The rules of the game are pretty simple, use the clues to find the stashed QR code around your house,
Scan it, save aside the code you're getting from each clue.

At the end you'll be able to decode that with all the clues you found so far with a dedicated private GPG key that has been generated just for you!

### Example
![](https://storage.googleapis.com/shell-gems.appspot.com/img/esc.png)
https://storage.googleapis.com/shell-gems.appspot.com/img/index.html

### How to install
```bash
npm i -g esc-gnr
```

### How to use
 1. Create and navigate to a dedicated work folder
 2. Execute the cmd to initiate a new escape room project
```bash
esc-gnr
```
 3. Fill the questionnaire.
 4. Once done, deploy the entire content of `/public` folder, and print the file `manual.pdf`.
    > Currently, there's also a `/keys` folder that been created with the GPG keys, in the future the private key will be provided to download at the last stage of the game.
 5. Spread the QR codes around the house base on the hints you filled in the wizard.
 6. Send your loved one to a quest and reduce COVID  boredom.

> In the last stage of the quest, the user will receive his private key in order to decode the entire clue.


### NEW Features
 - [X] Add YouTube support
 - [X] Include giphy and any other external source
 - [X] Generate a PDF with all the QR codes

### TODO:
 - [ ] Generate firebase project file.
 - [ ] Allow to download the private GPG key at the last stage of the game.



## License

[MIT](https://tldrlegal.com/license/mit-license)

[license-image]: https://img.shields.io/npm/l/esc-gnr?style=flat-square
[license-url]: https://tldrlegal.com/license/mit-license
[npm-image]: https://img.shields.io/npm/v/esc-gnr.svg?style=flat-square
[npm-url]: https://npmjs.org/package/esc-gnr
