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
			"align_text": ["left", "right"],
			"animation_type": ["fade-out", "slide-up", "slide-down", "slide-left", "slide-right"],
			"position_x": ["left", "right"],
			"position_y": ["top", "bottom"],
      "template_type": ['single_line', 'two_lines']
		};

	  	res.render('home', { 'formData': JSON.parse(data), 'formOptions': options });
	});

	return router;
};
