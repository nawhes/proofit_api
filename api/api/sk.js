
'use strict'

const express = require('express');
const router = express.Router();

const sk = require('./skcode');

//parameters - email, documentid
router.post('/read', sk.read);


module.exports = router;
