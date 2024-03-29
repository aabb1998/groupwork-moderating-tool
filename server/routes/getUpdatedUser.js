const router = require('express').Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  try {
    const user = await User.findOne(req.body.id);
    if (user) return res.status(409).send({ message: 'User found!' });

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;
