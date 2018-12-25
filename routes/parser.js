var express = require('express');
const {
  parsers: {
    doParserWork
  }
} = require('../controllers');

var router = express.Router();

/* GET users listing. */
router.get('/', doParserWork);

module.exports = router;
