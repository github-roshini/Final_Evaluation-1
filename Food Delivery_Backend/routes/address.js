const express = require('express');
const Address = require('../schemas/addressSchema');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
