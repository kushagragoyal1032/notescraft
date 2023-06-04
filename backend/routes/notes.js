const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    obj = {
        a: "notes",
        no: 5
    }
    res.json(obj);
})

module.exports = router; 