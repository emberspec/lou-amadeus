const express = require('express');
const router  = express.Router();
const request = require('request');




router.get('/dashboard', (req, res, next) => {
  //res.render('admin/users', { page: 'admin', title: 'Express'} );
  console.log('encoder dashboard');
  next();
});

module.exports = router;
