
'use strict'

const express = require('express');
const router = express.Router();

const code = require('./toeiccode');

//parameters - email, pin, record
router.post('/input', code.input);

//parameters - email, pin
router.post('/query', code.query);

//parameters - email, pin
router.post('/delete', code.del);


module.exports = router;
