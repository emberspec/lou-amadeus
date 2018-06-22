const express = require('express');
const router  = express.Router();
const request = require('request');



router.get('/dashboard', (req, res, next) => {
  	res.render('admin/users', { page: 'transactions', title: 'Express'} );
});

router.get('/airlines', (req, res, next) => {
	
	request.post({
	    url: 'http://esales.limcontravel.com/api/v5/airline/transaction/list',
	    json: true,
	    form: {
	    	md: localStorage.getItem('md'),
	    	msgpad: localStorage.getItem('msgpad'),
	    	agency: req.query.agency || '',
	    	customer: req.query.customer || '',
	    	encoder: req.query.encoder || '',
	    	start_date: req.query.start_date || '',
	    	end_date: req.query.end_date || '',
	    	iata_code: req.query.iata_code || '',
	    	limit: req.query.limit || '',
	    	page: req.query.page || '',
	    	customer: req.query.customer || '',
	    	status: req.query.status || '',
	    	ticket_type: req.query.ticket_type || '',
	    	trans_id: req.query.trans_id || '',
	    }
	}, function (error, response, body) {
		
	    if (!error && response.statusCode === 200) {
	    	
	    	res.render('admin/airlines', { page: 'airlines', airlines: body.data, next: body.next, back: body.prev, current: body.current});

	    }else if (!error && response.statusCode === 404){
	    	localStorage.removeItem('isLogin');
	    	res.redirect("../login");
	    }
	});
  	
});


router.post('/airliness', (req, res, next) => {
	request.post({
	    url: 'http://esales.limcontravel.com/api/v5/airline/transaction/list',
	    json: true,
	    form: {
	    	md: localStorage.getItem('md'),
	    	msgpad: localStorage.getItem('msgpad'),
	    	agency: req.body.agency || '',
	    	customer: req.body.customer || '',
	    	encoder: req.body.encoder || '',
	    	start_date: req.body.start_date || '',
	    	end_date: req.body.end_date || '',
	    	iata_code: req.body.iata_code || '',
	    	limit: req.body.limit || '',
	    	page: req.body.page || '',
	    	customer: req.body.customer || '',
	    	status: req.body.status || '',
	    	ticket_type: req.body.ticket_type || '',
	    	trans_id: req.body.trans_id || '',

	    }
	}, function (error, response, body) {
		
	    if (!error && response.statusCode === 200) {
	    	res.send(body);

	    }else if (!error && response.statusCode === 404){
	    	localStorage.removeItem('isLogin');
	    	res.redirect("../login");
	    }

	});

});


router.get('/try', (req, res, next) => {

	console.log(req.query);
  	
});


	

module.exports = router;
