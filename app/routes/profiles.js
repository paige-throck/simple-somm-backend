const express = require('express');
const router = express.Router();
const knex = require('../db');
const session = require('express-session');

// filterInt - The function from MDN that confirms a particular value is actually an integer. Because parseInt isn't quite strict enough.
const filterInt = function(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
};

//Profile route---------------

router.get('/:id' , (req, res, next) => {
  
  let sessionID = filterInt(req.session.userID);
  let paramsID = filterInt(req.params.id);
  console.log('The session ID - ', req.session.userID);
  console.log('The user ID - ', req.params.id);
  if (sessionID === paramsID) {
    console.log('params ID and user ID match.');
    next();
  } else {
    console.log(`params ID and user ID don't match.`);
    res.redirect('/');
  }
});


// router.get('/:id/winelist', (req, res, next)=>{
//   const id = filterInt(req.params.id);
//   knex('wine_lists')
//   .select('wine_ids')
//   .where(id, 'user_id')
//   .then((wine_ids)=>{
//     console.log();
//   })
// })


//update ----------------------
router.put("/:id", function(req, res){
  const id = req.params.id;
  const updatedUser = {
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
    address: req.body.address,
    zipcode: req.body.zipcode,
    cuisine: req.body.cuisine,
    email: req.body.email,
  };
  //knex logic
  knex('users')
  .where('id', id)
  .update(updatedUser)
  .then(() => {
      res.send("update your profile")
  })
})

//delete account----------------
router.delete('/:id', function(req, res){
  const id = req.params.id;
  //knex logic
  knex('users')
  .where('id', id)
  .del()
  .then(() => {
    res.send('DELETED')
  })
})
module.exports = router;
