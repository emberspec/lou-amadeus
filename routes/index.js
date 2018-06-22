const express = require('express');
const router  = express.Router();
const request = require('request');



router.get('/', (req, res, next) => {
	if (localStorage.getItem('isLogin') === null) {
		res.redirect("/login"); 
	}else{
		res.render('index', { page: 'dashboard', title: 'Express'} );
	}

	
});


router.get('/login', (req, res, next) => {
	if (localStorage.getItem('isLogin')) {
		res.redirect("/"); 
	}else{
		res.render('login', { error: '', username: req.body.username, password: req.body.password} );
	}
	

});

router.post('/login', (req, res, next) => {



	request.post({
	    url: 'http://esales.limcontravel.com/api/v5/auth',
	    json: true,
	    form: {
	    	username: req.body.username,
	    	password: req.body.password
	    }
	}, function (error, response, body) {
		
	    if (!error && response.statusCode === 200) {

	    	localStorage.setItem('isLogin', true);
	    	localStorage.setItem('msgpad', body.data.msgpad);
	    	localStorage.setItem('md', body.data.md);

	    	request.post({
			    url: 'http://esales.limcontravel.com/api/v5/status',
			    json: true,
			    form: {
			    	msgpad: localStorage.getItem('msgpad'),
			    	md: localStorage.getItem('md')
			    }
			}, function (error, response, body) {
				localStorage.setItem('userLevel', body.data.level.id);

				if (localStorage.getItem('userLevel') === "3") {
					res.redirect("admin/dashboard"); 
				}else if(localStorage.getItem('userLevel') === "2"){
					return console.log("encoder");
					next();
				}else if(localStorage.getItem('userLevel') === "1"){
					return console.log("manager");
					next();
				}else{
					return console('Undefined User Level');
					next();
				}

			});

	    }else if (!error && response.statusCode === 404){
	    	if (body.message === "Validation Error."){
	    		res.render('login', { error: 'username', username: req.body.username, password: req.body.password} );
	    	}else if(body.message === "Authentication failed."){
	    		res.render('login', { error: 'password', username: req.body.username, password: req.body.password} );
	    	}else{
	    		console.log("Error");
	    	}
	    }
	});

});

router.get('/logout', (req, res, next) => {
	localStorage.removeItem('isLogin');
	res.redirect("/login"); 
});




module.exports = router;
