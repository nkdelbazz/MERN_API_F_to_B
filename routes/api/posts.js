const express = require('express');  // serve per recuperare express
const router = express.Router(); // serve per creare un nuovo oggetto router 
const {check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { likes } = require('moongose/models');
// @route GET api/posts
// @desc  Test route 
// @access public

router.post('/',
[
    auth,[
        check('text','il testo è richiesto').not().isEmpty(),
    ]
]
, async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

   try{
    const user = await User.findById(req.user.id).select('-password')

    const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }
    post = new Post(newPost)
    await post.save()
    res.json(post)
   }
   catch(err){
    console.error(err)
    res.status(500).send('server Error')
   }

}) // è una route che viene generat con il nome del file + '/' 


// vedere tutti i post associati
router.get('/', auth, async (req, res) => {  
    try{
        const posts = await Post.find().sort({date: -1})
        res.json(posts)
       }
       catch(err){
        console.error(err)
        res.status(500).send('server Error')
       }
  });

// vedere solo il post nell' header
router.get('/:id', auth, async (req, res) => {  
    try{
        const post = await Post.findById(req.params.id).sort({date: -1})

        if(!post){
           return res.status(404).json({msg: 'not found'})
        }

        res.json(post)
       }
       catch(err){
        console.error(err)
        
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'not found'})
         }

        res.status(500).send('server Error')
       }
  });

  
// eliminare il post associato
router.delete('/:id', auth, async (req, res) => {  
    try{
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }

        if(post.user.toString() != req.user.id){
            return res.status(401).json({msg: 'User not authorized'})
        }
       
        await post.remove()


        res.json({msg: 'Post rimosso'})
       }
       catch(err){
        console.error(err)
        
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'not found'})
         }

        res.status(500).send('server Error')
       }
  });


  // eliminare il post associato
router.get('/:id', auth, async (req, res) => {  
    try{
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }

        if(post.user.toString() != req.user.id){
            return res.status(401).json({msg: 'User not authorized'})
        }
       
        await post.remove()


        res.json({msg: 'Post rimosso'})
       }
       catch(err){
        console.error(err)
        
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'not found'})
         }

        res.status(500).send('server Error')
       }
  });


    // @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.put(
    '/like/:id',
    [
     auth 
    ]
     ,
  async  (req, res) => {
  
    try{

        const post = await Post.findById(req.params.id)

        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
           return res.json(400).json({msg: 'post già con il like'})
        }

    post.likes.unshift({user: req.user.id}) 

    await post.save()

    res.json(post)

    }
    catch(err){
        console.error(err.message)
        res.status(500).send('error')
    }
    }
  );



      // @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.put(
    '/unlike/:id',
    [
     auth 
    ]
     ,
  async  (req, res) => {
  
    try{

        const post = await Post.findById(req.params.id)

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
           return res.json(400).json({msg: 'nessun post like'})
        }

    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

    post.likes.splice(removeIndex,1)
    await post.save()

    res.json(post)

    }
    catch(err){
        console.error(err.message)
        res.status(500).send('error')
    }
    }
  );



  //comment post 
  // id del post da commentare

  router.post('/comment/:id',
[
    auth,[
        check('text','il testo è richiesto').not().isEmpty(),
    ]
]
, async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

   try{
    const user = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.id)

    const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }
    post.comments.unshift(newComment)
    await post.save()
    res.json(post)
   }
   catch(err){
    console.error(err)
    res.status(500).send('server Error')
   }

}) //

// uso il token cerco per l utetne 
// cerca il POST 
// cerca il commento associato al post 
// elimina il post
router.delete('/comment/:id/:comment_id',
    auth
, async (req,res) => {
   try{
    const post = await Post.findById(req.params.id)
    const comment = post.comments.find(comment => comment.id === req.params.comment_id)
    
    if(!comment){
        return res.status(404).send({msg : 'comment not exixst'})
    }

    if(comment.user.toString() !== req.user.id){
        res.status(401).json({msg : 'user non autenticato per il commento'})
    }

    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

    post.comments.splice(removeIndex,1)
    await post.save()

     res.json(post.comments)  // commenti generali e comments finale
   }
   catch(err){
    console.error(err)
    res.status(500).send('server Error')
   }

}) //





module.exports = router; 
