var socketio = require('socket.io')

module.exports = function(io){

	var express = require('express');
	var router = express.Router();
	var path = require('path');
	var fs = require('fs');


	/* GET home page. */
	router.get('/', function(req, res, next) {

	  // get user preferences to build form
	  // Synchronous read
		var data = fs.readFileSync(path.join(__dirname, '/../../data/user_preferences.json'));

		var options = {
			'align_text': [{label: 'Align Left', value: 'left'},{label: 'Align Right', value: 'right'}],
			'animation_type': [{label: 'Fade Out', value: 'fade-out'}, {label: 'Slide Down from Top', value: 'slide-up'}, {label: 'Slide Up from Bottom', value: 'slide-down'}, {label: 'Slide In from the Left', value: 'slide-left'}, {label: 'Slide In from the Right', value: 'slide-right'}],
			'position_x': [{label: 'Align Left', value: 'left'}, {label: 'Align Right', value: 'right'}],
			'position_y': [{label: 'Align Top', value: 'top'}, {label: 'Align Bottom', value: 'bottom'}],
      'template_type': [{label: 'Single Line', value: 'single_line'}, {label: 'Two Lines', value: 'two_lines'}]
		};

	  	res.render('home', { 'formData': JSON.parse(data), 'formOptions': options });
	});

	return router;
};
