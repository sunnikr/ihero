const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('events route'));

module.exports = router;
