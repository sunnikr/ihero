const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator/check');


//@route get api/auth
//@desc get auth user
//@access Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


//@route POST api/auth
//@desc authenticate user
//@access Public

router.post(
    '/',
    [
       check('email', 'Please Enter a valid email').isEmail(),
      check(
        'password',
        'Password is required'
      ).exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
  
      try {
        let user = await User.findOne({ email: email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'invalid credentials' }] });
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res
            .status(400)
            .json({errors:[{msg:'invalid credentials'}]});
            
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 360000 },
          (err, token) => {
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
      }
  
      console.log(req.body);
    }
  );

module.exports = router;
