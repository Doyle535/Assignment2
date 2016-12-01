var express = require('express');
var router = express.Router();

var Contact = require('../models/contact');
var Account = require('../models/account');
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.redirect('/login');
  }
}

router.get('/', isLoggedIn, function(req, res, next) {
    Contact.find(function(err, contacts) {
       if (err) {
           console.log(err);
           res.render('error');
       }
        else {
           res.render('contacts', {
               contacts: req.user.contacts,
               title: 'Contacts',
               user: req.user
           });
       }
    });
});

router.get('/add', isLoggedIn, function(req, res, next) {
   res.render('add-contact', { title: 'Add a New Contact', user:req.user} );
});

router.post('/add', isLoggedIn,function(req, res, next) {
    Contact.create( {
       firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: req.body.birthday,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        email: req.body.email
    }, function(err, Contact1) {
        if (err) {
            console.log(err);
            res.render('error', { message: 'Could not add contact'} );
        }
        else {
          Account.findByIdAndUpdate(req.user._id,{$push: { contacts: Contact1}},
          {safe: true, upsert: true, new: true},
        function(err,model)
      {
        console.log(err);
      });
            res.redirect('/contacts');
        }
    });
});

router.get('/delete/:_id', isLoggedIn, function(req, res, next) {
    var _id = req.params._id;

    Contact.findById(_id, function(err,contact) {
       if (err) {
           console.log(err);
           res.render('error', {
               message: 'Could not delete contact',
               error: err,

           });
       }
        else {
          Account.findByIdAndUpdate(req.user._id,{$pull: {contacts: contact}},
          {safe: true, upsert: true, new: true},
        function(err,model)
      {
        console.log(err);
      });

           res.redirect('/contacts');
       }
    });
});

router.get('/:_id', isLoggedIn,function(req, res, next) {
    var _id = req.params._id;
    Contact.findById( { _id: _id }, function(err, contact) {
        if (err) {
            console.log(err);
            res.render('error', {
                message: 'Could not load contacts',
                error: err
            });
        }
        else {
            res.render('edit-contact', {
                title: 'Edit a contact',
                user: req.user,
                contact: contact
            });
        }
    });
});

router.post('/:_id', isLoggedIn, function(req, res, next) {
    var _id = req.params._id;
    Contact.findById(_id, function(err,contact) {
      Account.findByIdAndUpdate(req.user._id, {$pull: {contacts: contact}}, function(err) {
         if (err) {
             console.log(err);
             res.render('error', {
                 message: 'Could not update contact',
                 error: err
             });
         }
          else {

            var contact = new Contact({
               _id: _id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthday: req.body.birthday,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                email: req.body.email
            });
            Account.findByIdAndUpdate(req.user._id, {$push: {contacts: contact}}, function(err) {
               if (err) {
                   console.log(err);
                   res.render('error', {
                       message: 'Could not update contact',
                       error: err
                   });
               }
                else {

                   res.redirect('/contacts');
               }
             });
           }
      });
    });



});

module.exports = router;
