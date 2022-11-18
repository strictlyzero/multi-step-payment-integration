const express = require('express')
const bodyParser = require("body-parser");
const path = require('path');
const axios = require("axios");
const open = require('open');


const router = express.Router();
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static('images'))

const url = 'https://api.paywithzero.net/v1/public/payment';
const username = 'support@zerosurcharging.com';
const password = 'demo123*';
const hash = 'BL2H6LGNEUGSXTBARA59';

const authEncode = Buffer.from(`${username}:${password}`).toString('base64')

router.get('/rate', async (req, res, next) => {
    const rate = req.query;

    const basicAuth = `Basic ${authEncode}`;
    const options = {
        headers: {
            authorization: basicAuth,
            'key-hash': hash,
        },
        params: {
            ...rate
        }
    };
    try {
        axios.get(`${url}/rate`, options)
            .then(response => res.json(response.data))
            .catch(err => next(err));

    } catch (error) {
        throw new Error(error.response.data.message || error);
    }
})

router.post('/charge', async (req, res, next) => {
    const charge = req.body;

    const basicAuth = `Basic ${authEncode}`;
    const options = {
        headers: {
            authorization: basicAuth,
            'key-hash': hash,
        },
    };
    const dataSend = {
        "amount": charge.amount,
        "contact": charge.contact,
        "billingAddress": charge.billingAddress,
        "shippingAddress": charge.shippingAddress,
        "order": charge.order,
        "capture": true,
        "card": {
            "name": charge.card.name,
            "number": charge.card.number,
            "paymentToken": charge.card.paymentToken
        },
        "sendReceipt": true
    }

    try {
        axios.post(
            `${url}/charge`,
            dataSend,
            options)
            .then(response => res.json(response.data))
            .catch(err => {
                next(err);
            });


        // return data;

    } catch (error) {
        throw new Error(error.response.data.message || error);
    }
})

router.get('/success', function (req, res) {
    res.json({ hola: 'hola' })
});

router.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.use("/", router);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    open('http://0.0.0.0:3000');
})

