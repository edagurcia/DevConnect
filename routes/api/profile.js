const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const request = require('request')
const config = require('config')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

// @route       GET api/profile/me
// @desc        Get current user profile data
// @access      Private

router.get('/me', auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
    
    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user'})
    }

    res.json(profile)


  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

// @route       POST api/profile/
// @desc        Create or update user profile
// @access      Private

router.post('/', auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
], async (req, res) => {

  // validation errors
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    company,
    status,
    skills,
    website,
    bio,
    location,
    githubusername,
    youtube,
    twitter,
    facebook,
    instagram,
    linkedin
  } = req.body

  // crear el objeto de profile
  const profileFields = {}
  profileFields.user = req.user.id

  // verificar que los campos traigan data antes de crear o actualizar
  if(company) profileFields.company = company
  if(website) profileFields.website = website
  if(location) profileFields.location = location
  if(bio) profileFields.bio = bio
  if(status) profileFields.status = status
  if(githubusername) profileFields.githubusername = githubusername
  // cuando viene un arreglo las reglas de verificacion deben saber que es un arreglo
  if(skills) {
    profileFields.skills = skills.toString().split(',').map(skill => skill.trim())
  }

  // arreglo del objeto para social
  profileFields.social = {}
  if(youtube) profileFields.social.youtube = youtube
  if(twitter) profileFields.social.twitter = twitter
  if(facebook) profileFields.social.facebook = facebook
  if(linkedin) profileFields.social.linkedin = linkedin
  if(instagram) profileFields.social.instagram = instagram
  
  try {

    let profile = await Profile.findOne({ user: req.user.id })

    if(profile) {
      // actualizar perfil
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id }, 
        { $set: profileFields }, 
        { new: true }
      )
      return res.json(profile)
    }

    // crear perfil

    profile = new Profile(profileFields)
    await profile.save()
    res.json(profile)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }  
})

// @route       GET api/profile/
// @desc        Get all profiles
// @access      Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

// @route       GET api/profile/user/:user_id
// @desc        Get single profiles
// @access      Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
    if(!profile) {
      return res.status(400).json({ msg: 'Profile not found'})
    }
    res.json(profile)
  } catch (error) {
    console.error(error.message)
    if(error.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'Profile not found'})
    }
    res.status(500).send('Server error')
  }
})

// @route       DELETE api/profile/user/:user_id
// @desc        Delete user, profile and posts
// @access      Private

router.delete('/', auth, async (req, res) => {
  try {

    // borra todos los posts del usuario
    await Post.deleteMany({ user: req.user.id })
    // borra el profile del usuario
    await Profile.findOneAndRemove({ user: req.user.id })
    // borra el usuario
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'User deleted' })

  } catch (error) {
    console.error(error.message)
    if(error.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'Profile not found'})
    }
    res.status(500).send('Server error')
  }
})

// @route       PUT api/profile/experience
// @desc        Add profile experience
// @access      Private

router.put('/experience', auth, [
  check('title','Title is required').not().isEmpty(),
  check('company','Company is required').not().isEmpty(),
  check('from','From date is required').not().isEmpty()
], async (req, res) => {
  // validation errors
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {

    const profile = await Profile.findOne({ user: req.user.id })
    profile.experience.unshift(newExp)
    await profile.save()
    res.json(profile)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }

})

// @route       DELETE api/profile/experience/:exp_id
// @desc        Delete profile experience
// @access      Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({ user: req.user.id })
    // get the experience id to remove
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
    profile.experience.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
    
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})


// @route       PUT api/profile/education
// @desc        Add profile education
// @access      Private

router.put('/education', auth, [
  check('school','School is required').not().isEmpty(),
  check('degree','Degree is required').not().isEmpty(),
  check('fieldofstudy','Field of study is required').not().isEmpty(),
  check('from','From date is required').not().isEmpty()
], async (req, res) => {
  // validation errors
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try {

    const profile = await Profile.findOne({ user: req.user.id })
    profile.education.unshift(newEdu)
    await profile.save()
    res.json(profile)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }

})

// @route       DELETE api/profile/experience/:edu_id
// @desc        Delete profile experience
// @access      Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({ user: req.user.id })
    // get the experience id to remove
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
    profile.education.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
    
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

// @route       GET api/profile/github/:username
// @desc        Get github profile repos
// @access      Public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: {'user-agent':'node.js'}
    }

    request(options, (error, response, body) => {
      if(error) console.error(error)
      if(response.statusCode !==200) {
        res.status(404).json({ msg: 'No Github profile found' })
      }
      res.json(JSON.parse(body))
    })

  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
