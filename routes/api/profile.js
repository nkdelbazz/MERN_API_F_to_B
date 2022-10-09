const express = require('express');  // serve per recuperare express
const router = express.Router(); // serve per creare un nuovo oggetto router 
const auth =  require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const {check, validationResult} = require('express-validator')

// @route GET api/profile/me
// @desc  valori del profilo utente 
// @access Private

router.get('/me',auth, async (req,res) => {
    try{
     const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar'])  // vedere il model del profile che si collega con l id del user
     if(!profile){
        return res.status(404).json({msg: 'non esiste un profilo associato'})
     } 

     res.json(profile)

    }
    catch(err){
        console.error(err.message)
        res.status(500).send('Server error');
    }
}) // è una route che viene generat con il nome del file + '/' 

// @route POST api/profile/me
// @desc  create or update del profilo utente 
// @access Private

router.post(
    '/',
    [
      auth,
      [
      check('status','lo stato è richiesto').not().isEmpty(),
      check('skills','sono richieste le skill').not().isEmpty()
      ]
    ],
    async (req,res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()})
        }
      
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername)
            profileFields.githubusername = req.body.githubusername;
        // Skills - Spilt into array
        if (req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',').map(skill => skill.trim())
        }

        // Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

       //res.json({profileFields}); fa vedere tutti i valori 

       try{
          let profile = await Profile.findOne({user : req.user.id})
          if(profile){
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, // trovami l' id 
                {$set: profileFields},
                {new:true} //}
                )
            return res.json(profile)
          }

          //
          profile = new Profile(profileFields)
          await profile.save()
          return res.json(profile)

       }
       catch(err){
        console.error(err.message)
        res.status(500).send('Server error')

       }


    })


    router.get('/user/:user_id', (req, res) => {
        const errors = {};
      
        Profile.findOne({ user: req.params.user_id })
          .populate('user', ['name', 'avatar'])
          .then(profile => {
            if (!profile) {
              errors.noprofile = 'There is no profile for this user';
              res.status(404).json(errors);
            }
      
            res.json(profile);
          })
          .catch(err =>
            res.status(404).json({ profile: 'There is no profile for this user' })
          );
      });


      // @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
    '/',
    auth,
    async (req, res) => {
        try{
            await Profile.findOneAndRemove({ user: req.user.id });
            await User.findOneAndRemove({ _id: req.user.id });
                 res.json({ success: true ,eliminazione : req.user.name}) 
        }
        catch(err){
            console.error(err.message)
            res.status(500).send('Server in errore')
        }
     
    }
  );


  // @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.put(
    '/experience',
    [
     auth ,
     [
        check('title','serve il titolo.').not().isEmpty(),
        check('company','serve il company.').not().isEmpty(),
        check('from','serve il from.').not().isEmpty(),
     ]  
    ]
     ,
  async  (req, res) => {
  
      // Check Validation
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
  
    
      Profile.findOne({ user: req.user.id }).then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
  
        // Add to exp array
        profile.experience.unshift(newExp);
  
        profile.save().then(profile => res.json(profile));
      });
    }
  );


  // @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  auth,
 async  (req, res) => {
   try {

    const profile = await Profile.findOne({user: req.user.id})
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
    profile.experience.splice(removeIndex, 1)

    await profile.save() // salvataggio del profilo
    res.json(profile)
   }
   catch(err){
    console.error(err.message)
    res.status(500).send('Errore del server')
   }
  }
);



  // @route   POST api/profile/education
// @desc    Add experience to profile
// @access  Private
router.put(
  '/education',
  [
   auth ,
   [
      check('school','serve la scuola.').not().isEmpty(),
      check('degree','serve la laurea.').not().isEmpty()
      //check('fieldofStudy','serve il campo di studi.').not().isEmpty(),
   ]  
  ]
   ,
async  (req, res) => {

    // Check Validation
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
  }

  var moment = require('moment-timezone');
  var insert_date = moment(req.body.from , "YYYY/MM/DD").toDate();

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofStudy: req.body.fieldofStudy,
        from: insert_date,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);


// @route   DELETE api/profile/education/:edu_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
'/education/:edu_id',
auth,
async  (req, res) => {
 try {

  const profile = await Profile.findOne({user: req.user.id})
  const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
  profile.education.splice(removeIndex, 1)

  await profile.save() // salvataggio del profilo
  res.json(profile)
 }
 catch(err){
  console.error(err.message)
  res.status(500).send('Errore del server')
 }
}
);










module.exports = router; 
