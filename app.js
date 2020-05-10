const canvas = require('canvas')
require('@tensorflow/tfjs-node') // Load before @teachablemachine/image
const tmImage = require('@teachablemachine/image')
const express = require('express')
const fs = require('fs')
const multer = require('multer')
var storage = multer.memoryStorage()
const upload = multer({storage: storage})
const app = express();

const url = 'http://localhost:3000/'

app.use(require('body-parser').raw({type: 'image/png', limit: '3MB'}));
app.use(express.static('models'));

addEndpoint("batalha", url);
addEndpoint("chave", url);
addEndpoint("grupo", url);
addEndpoint("notificacoes", url);
addEndpoint("saida", url);
addEndpoint("salas", url);

const JSDOM = require('jsdom').JSDOM;
global.window = new JSDOM(`<body><script>document.body.appendChild(document.createElement("hr"));</script></body>`).window;
global.document = window.document;
global.fetch = require('node-fetch');

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

async function addEndpoint(name, URL) {
    const modelURL = URL + name + '/model.json';
    const metadataURL = URL + name + '/metadata.json';
    let model = await tmImage.load(modelURL, metadataURL);
    app.post('/' + name, upload.single('image'), (req, res) => {
        console.log(req.file)
        getPrediction(model, _arrayBufferToBase64(req.file.buffer), (output) => {
            res.send(output)
            return
        });
    });
}

async function getPrediction(model, data, fu) {
    const can = canvas.createCanvas(64, 64);
    const ctx = can.getContext('2d');

    const img = new canvas.Image();
    img.onload = async () => {
        ctx.drawImage(img, 0, 0, 64, 64);

        const prediction = await model.predict(can);
        console.log(prediction);
        fu(prediction);
    }
    img.onerror = err => {
        throw err;
    }
    img.src = "data:image/png;base64," + data;
}

function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}