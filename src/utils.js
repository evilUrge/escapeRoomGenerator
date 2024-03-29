const fs = require('fs'),
    path = require('path'),
    baseDir = process.cwd(),
    crypto = require('crypto'),
    {conf} = require('./constant')

const demo = {name: 'yaniv'}
Object.assign(demo, {gamer:true})

module.exports = {
    generateId: (le = 8) => crypto.randomBytes(le).toString('hex'),
    generatePage: (title, id, gpg_code, hint, qr, current, len) =>
        fs.writeFile(`${baseDir}/public/${id}/index.html`,
            fs.readFileSync(path.join(__dirname, 'templates', 'stage.html')).toString()
                .replace('{{code}}', gpg_code)
                .replace('{{hint}}', hint)
                .replace('{{qr}}', qr)
                .replace('{{current}}', current)
                .replace('{{len}}', len)
                .replace(/{{title}}/g, title)
            , 'utf8',
            (err) => err
                ? console.error(`failed to write new html: ${err}`)
                : process.exit()),
    createPDF: arrayOfQR =>
        require('mustache-async').render(fs.readFileSync(path.join(__dirname, 'templates', 'manual.html'), 'utf8'),
            {data: arrayOfQR}).then(manual =>
            require('html-pdf').create(manual, {format: 'A4'})
                .toFile(`${baseDir}/manual.pdf`, (err, res) => err ? console.log(err) : true)),
    qr: stringToQR => require('qrcode').toDataURL(stringToQR),
    generateGPG: (publicKeyFileName, privateKeyFileName) => {
        const keys = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        [{n:publicKeyFileName, k:'publicKey'}, {n:privateKeyFileName,k:'privateKey'}].map(i => {
            fs.writeFileSync(`${baseDir}/public/keys/${i.n}.key`, keys[i.k], 'utf8',
                (err) => err
                    ? console.error(`failed to write new html: ${err}`)
                    : process.exit())
        })
        return keys
    },
    encryptStringWithRsaPublicKey: (toEncrypt, privateKeyFileName) => crypto.publicEncrypt(fs.readFileSync(`${baseDir}/public/keys/${privateKeyFileName}.key`, "utf8"), Buffer.from(toEncrypt)).toString("base64"),
    decryptStringWithRsaPrivateKey: (toDecrypt) => crypto.privateDecrypt(fs.readFileSync(`${baseDir}/keys/privateKey.key`, "utf8"), Buffer.from(toDecrypt, "base64")).toString("utf8"),
    folderInit: (arrayOfIds) =>
        ['public', 'public/keys'].concat(arrayOfIds.map(id => `public/${id}`))
            .forEach(name => !fs.existsSync(`${baseDir}/${name}`) && fs.mkdirSync(`${baseDir}/${name}`)),
    strSlicer: (str, num) => {
        const len = str.length / num;
        const creds = str.split("").reduce((acc, val) => {
            let {res, currInd} = acc;
            if (!res[currInd] || res[currInd].length < len) {
                res[currInd] = (res[currInd] || "") + val;
            } else {
                res[++currInd] = val;
            }
            return {res, currInd};
        }, {
            res: [],
            currInd: 0
        });
        return creds.res;
    }
}