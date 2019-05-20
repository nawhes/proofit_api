
const express = require('express');
const router = express.Router();




//firebase
const admin = require('firebase-admin');
const serviceAccount = require('../proofit-firebase-adminsdk-3nhjp-71e627d9d8.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://proofit-api.firebaseio.com'
});


const account = require('./account')
const proofit = require('./proofit')


//parameters - email, pin
router.post('/join', account.join);

//parameters - email, pin, channel, issuer
router.post('/query', account.query);


//parameters - email, documentid, documentpw
router.post('/create', proofit.create);

//parameters - email, documentid, documentpw, pin, channel, issuer
router.post('/append', proofit.append);

//parameters - email, documentid, documentpw
router.post('/appendemail', proofit.appendEmail);

//parameters - email, documentid
router.post('/read', proofit.read);

//parameters - email, documentid, documentpw
router.post('/delete', proofit.del);

module.exports = router;
