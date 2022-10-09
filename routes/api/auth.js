const express = require('express');  // serve per recuperare express
const router = express.Router(); // serve per creare un nuovo oggetto router 
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route GET api/auth
// @desc  Test route 
// @access public

//auth è la funzione richiamata per fare in modo che ci sia il next o no per autorizzare 
// la rotta 

router.get('/',auth, async (req,res) => {
try {
  const user = await User.findById(req.user.id).select('-pasword')
  res.json(user)
}catch(err){
    console.error(err.message)
    res.status(500).send('Server Error')

}
})// è una route che viene generat con il nome del file + '/' 


// serve per fare il login
router.post(
  '/',
  [
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters')
    .isLength({min:6}).isLength({max:40}).exists()
  ],
  async (req,res) => {
    console.log(req.body); //
    const errors = validationResult(req) 
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }

    const {email , password} = req.body  // prendi il json e mettilo dentro qui 

    try{
      let user = await User.findOne({email}) // presa da sopra 
      if(!user){
          res.status(400).json({errors: [{message: 'le credenziali non sono valide user non trovato'}]})
      }

      // compara la password non criptata in input con la password criptata del database
      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch){
        res.status(400).json({errors: [{message: 'le credenziali non sono valide non cè stato il match'+ user.password}]})
      }

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
