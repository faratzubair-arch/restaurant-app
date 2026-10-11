// server/routes/tableRoutes.js
const express = require('express');
const router = express.Router();
const { getTables } = require('../controllers/tableController');

router.get('/', getTables);

module.exports = router;