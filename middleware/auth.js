const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){
    // Get token from Header
    const token = req.header('x-auth-token')

    if(!token){
        return res.status(401).json({msg : 'NO token and not autorized'})
    }

    try {

        const decoded = jwt.verify(token,config.get('jwtSecret')) // verificami se il token ha la stringa 

        req.user = decoded.user // ora l' user è stato decodificato e si setta in ogni req l'user
        next();
    } catch(err){
      res.status(401).json({msg:'Token not valid'})
    }
}