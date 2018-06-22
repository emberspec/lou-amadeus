const express = require('express');
const router  = express.Router();
const request = require('request');
let passengers = [];
let contacts = [];
let itineraries = [];

router.get('/availability', (req, res, next) => {
	res.render('amadeus/index');
});

router.post('/availability', (req, res, next) => {
	request.post({
	    url: 'http://esales.limcontravel.com/api/amadeus/air/availability',
	    json: true,
	    form: {
	    	departure_date: req.body.departure_date || '',
	    	arrival_date : req.body.arrival_date || '',
	    	from: req.body.from || '',
	    	to: req.body.to || '',
	    }
	}, function (error, response, body) {
		
	    if (!error && response.statusCode === 200) {
	    	//console.log(body.data);
	    	res.send(body.data);
	    	
	    }
	});

  	
});

router.post('/segments', (req, res, next) => {
	for (var i in req.body.itineraries) {
		itineraries.push(req.body.itineraries[i]);
	}

	//itineraries.push(req.body.itineraries);
	console.log(itineraries);


	res.send("success");

});

router.post('/passengers', (req, res, next) => { 
	for (var i in req.body.passengers) {
		passengers.push(req.body.passengers[i]);
	}

	//console.log(passengers);

	res.send("success");
	

});

router.post('/contacts', (req, res, next) => { 

	for (var i in req.body.contact) {
		contacts.push(req.body.contact[i]);
	}

	//console.log(contacts);

	request.post({
	    url: 'http://esales.limcontravel.com/api/amadeus/pnr/create',
	    json: true,
	    form: {
	    	passengers: passengers || '',
	    	itineraries: itineraries || '',
	    	contacts: contacts || ''
	    }
	}, function (error, response, body) {
		
	    if (!error && response.statusCode === 200) {
	    	console.log(body.data);
	    	//console.log(body.data.pnrHeader.reservationInfo.reservation.controlNumber);
	    	if(body.status == "OK"){
	    		console.log(body.data);
	    		res.send(body.response.pnrHeader.reservationInfo.reservation.controlNumber);
		    	passengers = [];
		    	segments = [];
		    	itineraries = [];
		    	contacts = [];
	    	}else if(body.status == "ERR"){
	    		res.send(body.messages[0].text);
	    		passengers = [];
		    	segments = [];
		    	itineraries = [];
		    	contacts = [];
	    	}	
	    	
	    }else{
	    	res.send(body.data);
	    	passengers = [];
	    	segments = [];
	    	itineraries = [];
	    	contacts = [];
    }
	});

	// passengers = [];
	// segments = [];
	// itineraries = [];
	// contacts = [];
});	

router.get('/record', (req, res, next) => {
	res.render('amadeus/record');
});

router.post('/record', (req, res, next) => {
	request.post({
	    url: 'http://esales.limcontravel.com/api/amadeus/pnr/retrieve',
	    json: true,
	    form: {
	    	record_locator : req.body.recordLocator || ''
	    }
	}, function (error, response, body) {

	    if (!error && response.statusCode === 200) {
	    	
	    	//console.log(body.data.pnrHeader.reservationInfo.reservation.controlNumber);
	    	if(body.code == 100){
	    		res.send(body.data);
	    	}
	    	
	    }else{
	    	res.send(console.log(body.data));
	    }
	});
});

router.post('/recommendation', (req, res, next) => {
	let arrayIndexSell = 0;
	let eachSegmentSell = {};
	let sellSegments = [];
	let sellItineraries = [];

	for (var key in req.body) {

		if(key.substring(12,16) == "date"){
			eachSegmentSell['date'] = req.body[key];
		}

		if(key.substring(12,16) == "city"){
			eachSegmentSell['cityCode'] =  req.body[key];
		}

		if(key.substring(12,16) == "free"){
			eachSegmentSell['freeText'] =  req.body[key];
		}
		
		if(key.substring(12,16) == "orig"){
			eachSegmentSell['origin'] =  req.body[key];
		}

		if(key.substring(12,16) == "dest"){
			eachSegmentSell['destination'] =  req.body[key];
		}

		if(key.substring(12,16) == "flig"){
			eachSegmentSell['flightNumber'] =  req.body[key];
		}

		if(key.substring(12,16) == "book"){
			eachSegmentSell['bookingClass'] =  req.body[key];
		}

		if(key.substring(12,16) == "comp"){
			eachSegmentSell['company'] =  req.body[key];
		}

		if(key.substring(12,16) == "type"){
			eachSegmentSell['type'] =  req.body[key];
		}

		arrayIndexSell = arrayIndexSell + 1;	

		if(arrayIndexSell == 9){
			segments.push(eachSegmentSell);
			eachSegmentSell = {};
			arrayIndexSell= 0;
		}

	}

	


	sellItineraries[0] = {
		segments : segments
	};

	request.post({
	    url: 'http://esales.limcontravel.com/api/amadeus/air/sellfromrecommendation',
	    json: true,
	    form: {
	    	itineraries  : sellItineraries || ''
	    }
	}, function (error, response, body) {

	    if (!error && response.statusCode === 200) {
	    	console.log(body);
	    	if(body.code == 100){
	    		res.send(body.data.message.messageFunctionDetails.messageFunction);
	    	}
	    	
	    }else{
	    	res.send(console.log(body.data));
	    }
	});
});


module.exports = router;

