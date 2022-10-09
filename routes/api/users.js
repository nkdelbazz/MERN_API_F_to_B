const express = require('express');  // serve per recuperare express
const router = express.Router(); // serve per creare un nuovo oggetto router 
const {check, validationResult} = require('express-validator')
const gravatar = require('gravatar');
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// @route GET api/users
// @desc  Test route 
// @access public

router.get('/', (req,res) => res.send('User route')) // è una route che viene generat con il nome del file + '/' 

router.post(
    '/',
    [
      check('name','Name is required').not().isEmpty(),
      check('email','Please include a valid email').isEmail(),
      check('password','Please enter a password with 6 or more characters')
      .isLength({min:6}).isLength({max:40})
    ],
    async (req,res) => {
      console.log(req.body); //
      const errors = validationResult(req) 
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
      }

      const {name , email , password} = req.body  // prendi il json e mettilo dentro qui 

      try{
        let user = await User.findOne({email}) // presa da sopra 
        if(user){
            res.status(400).json({errors: [{message: 'user esiste già'}]})
        }

        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })
        
        user = new User({
            name,
            email,
            avatar,
            password
        })

        //creazione del salt più la password 
        const salt = await bcrypt.genSalt(10)  //viene creato il salt per la password cryptata
        user.password = await bcrypt.hash(password,salt);
        await user.save();

        const payload = {
          // viene passao l' id che si trova storicizzato nel nostro database
          user: {
            id: user.id
          }
        }

        jwt.sign(payload,
                 config.get('jwtSecret'),
                 {expiresIn: 360000},
                 (err,token) => {
                  if(err) throw err;
                  res.json({token});

                 });

      }
      catch(err){
        console.error(err.message);
        res.status(500).send("server error")

      }
      // vedere se l user esiste 
      // gestione del JWT 



    //  res.send('User post route')
})

module.exports = router; 
