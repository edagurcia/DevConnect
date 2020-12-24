const express = require('express')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/auth')
const config = require('config')

// @route       GET api/auth
// @desc        Get user data
// @access      Private

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

// @route       POST api/auth
// @desc        Authenticate user & get token
// @access      Public

router.post('/', 
  // valida la informacion de login
[
  check('email','Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], 

  async (req, res) => {

  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  // recibe la informacion de correo y contraseña
  const { email, password } = req.body

  try {

    // busca si el usuario existe
    let user = await User.findOne({ email })
    if(!user){
      return res
        .status(400)
        .json({ msg: 'Invalid Credentials' })
    }

    // verifica si la contraseña es correcta
    const isMatch = await bcryptjs.compare(password, user.password)
    if(!isMatch) {
      return res
        .status(400)
        .json({ msg: 'Invalid Credentials' })
    }

    // si el correo y contraseña son correctas genera y envia el token

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload, config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if(err) throw err
        res.json({ token })
    })

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})


module.exports = router