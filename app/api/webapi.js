
const express = require('express');
const router = express.Router();


const account = require('./account')
const proofit = require('./proofit')



router.post('/join', account.join);

router.post('/query', account.query);


router.post('/create', proofit.create);

router.post('/append', proofit.append);

router.post('/appendemail', proofit.appendEmail);

router.post('/read', proofit.read);

router.post('/delete', proofit.del);

module.exports = router;
