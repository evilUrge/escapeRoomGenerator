const fs = require('fs'),
    path = require('path'),
    baseDir = process.cwd(),
    crypto = require('crypto'),
    mustache = require('mustache-async'),
    {conf} = require('./constant')

const demo = {name: 'yaniv'}
Object.assign(demo, {gamer:true})

module.exports = {
    generateId: (le = 8) => crypto.randomBytes(le).toString('hex'),
    generatePage: (title, id, gpg_code, qr, current, len, next = false, final = false) =>
        mustache.render(fs.readFileSync(path.join(__dirname, 'templates', 'stage.html'), 'utf8'),
                {
                    data: {
                        qr: qr, code: gpg_code, title: title, current: current, len: len,
                        next: next, final: final
                    }
                })
            .then(html => fs.writeFileSync(`${baseDir}/public/${id}/index.html`, html, 'utf8')),
    generateDecoder: (title, id)=>mustache.render(fs.readFileSync(path.join(__dirname, 'templates', 'decoder.html'),
        'utf8'), {data: {title:title}})
        .then(html => fs.writeFileSync(`${baseDir}/public/${id}/index.html`, html, 'utf8')),
    createPDF: arrayOfQR =>
        mustache.render(fs.readFileSync(path.join(__dirname, 'templates', 'manual.html'), 'utf8'),
            {data: arrayOfQR}).then(manual =>
            require('html-pdf').create(manual, {format: 'A4'})
                .toFile(`${baseDir}/manual.pdf`, (err, res) => err ? console.log(err) : true)),
    qr: stringToQR => require('qrcode').toDataURL(stringToQR),
    generateGPG: (publicKeyFileName, privateKeyFileName) => {
        const keys = crypto.generateKeyPairSync(conf.gpg.type, conf.gpg.options);
        [{n: publicKeyFileName, k: 'publicKey'}, {n: privateKeyFileName, k: 'privateKey'}].map(i => {
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