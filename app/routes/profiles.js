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

router.get('/:id', (req, res, next) => {
    const id = filterInt(req.params.id)
    knex('users').where('id', id).select('*')
        .then((user) => {
            console.log(user);
            res.json(user);
        })
        .catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        })
})


router.get('/:id/winelist', (req, res, next) => {
    let winesArr = [];
    const id = filterInt(req.params.id);
    console.log(req.params.id);

    return knex('wine_lists').where('user_id', id).select('wine_ids')
        .then((wines) => {
            let wineIds = wines[0].wine_ids
            console.log(wineIds);

            Promise.all(wineIds.map(wine => {
                return knex('wines')
                    .select('*')
                    .where("id", wine)
                    .then((w) => {

                        // winesArr.push(w[0])
                        w.forEach((p) => {
                            winesArr.push(p)
                        })
                    })
            })).then((response) => {

                res.send({
                    response: winesArr
                })
                console.log(winesArr, 'arararararayyyyy');
            })

        })

})





//update ----------------------
router.put("/:id", function(req, res) {
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
router.delete('/:id', function(req, res) {
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
