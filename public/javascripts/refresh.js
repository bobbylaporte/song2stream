// window.setTimeout(function(){
// 	location.reload();
// }, 4000);


var config = {};

var offline = true;
var socket;
var fetchTimer;
var autoHideTimer;

$(document).ready(function(){
	init();
});


function init(){

	console.log('init');

	socket = io('http://localhost:1337', { 'forceNew': true, 'reconnection': false });

	socket.on('connect', function () {
	  console.log('Client is connected to socket.');
	});

	socket.on('disconnect', function () {
	  offline = true;
	  console.log('Client disconnected from socket.');
	  goOffline('song2stream not detected');
	});

	if($('form').length > 0){
		$('.color').colorPicker();
	}



	if($('.card').length > 0){
		//get user preference




		$.ajax({
		  url: "http://localhost:1337/api/user_preferences"
		}).done(function(response) {

			// Got user preferences
			config = response;


			$('head').append('<style>@import url("https://fonts.googleapis.com/css?family=' + config.font_family.replace(' ', '+') + '");</style>');


			$('.card').addClass(config.position_x).addClass(config.position_y);
			$('.card').css('fontSize', config.font_size);
			$('.card').css('fontFamily', config.font_family);
			$('.card').css('color', config.font_color);
			$('.card').css('backgroundColor', config.background_color);
			$('.card').css('textAlign', config.align_text);

      $('.card').addClass(config.template_type);
			$('.card').addClass(config.animation_type);


      // Template Types
      // Single Line: Song Name - Artist Name
      // Two Lines:
      //      Song Name
      //      Artist Name (65% size and opacity)
      if(config.template_type === 'single_line'){
        $('.card .artist').hide();
      }


      //setTimeout(function(){
        $('.card').show();
        console.log('user preferences set');
        socket.emit('start_polling'); // Tell Server to start update track information
      //},500);


			// socket.on('first_connection', function(){ // Will run when server has new track info
			// 	console.log('first connection');
			// 	socket.emit('reset_track');
			// 	location.reload();

			// });

			socket.on('update_track', function(track){ // Will run when server has new track info
				console.log('update track');
				updateTrack(track);
			});

			socket.on('go_offline', function(){ // Will run when server cannot connect to spotify
				console.log('go offline');
				goOffline('Spotify Not Detected');
			});



		}).fail(function( jqXHR, textStatus ) {
			console.log('failed to get preferences, keep polling init until it comes up');
			// TODO: Start polling init until it comes back up
			setTimeout(function(){
				init();
			}, 2400);
		});


	}
}



function updateTrack(track){
	$( '.card' ).addClass(config.animation_type);

	setTimeout(function(){


    if(config.template_type === 'single_line'){
      $('.name').text(track.name +  ' - ' +  track.artist);
    }else{
      $('.name').text(track.name);
      $('.artist').text(track.artist);
    }




		$('.card').removeClass(config.animation_type);


		setTimeout(function(){

			$('.name').checkScrolling();

		  	// if(config.auto_hide > 0){
		  	// 	clearTimeout(autoHideTimer);
		  	// 	autoHideTimer = setTimeout(function(){
				 //  	$( '.card' ).addClass(config.animation_type);
				 // }, config.auto_hide * 1000);
		  	// }


		}, 800);


	}, 800);

};





function goOffline(reason){
	// Animate Card out and then
	$( '.card' ).addClass(config.animation_type);

	setTimeout(function(){

		  if(config.template_type === 'single_line'){
      $('.name').text('Offline' +  ' - ' +  reason);
    }else{
      $('.name').text('Offline');
      $('.artist').text(reason);
    }

		$('.card').removeClass(config.animation_type);


		setTimeout(function(){
			//socket.emit('reset_track');
			$('.name').checkScrolling();
			$('.artist').checkScrolling();



			// TODO: Start polling init until it comes back up
      if(reason === 'song2stream not detected'){
  			setTimeout(function(){
  				init();
  			}, 2400);
      }

		}, 800);

	}, 800);
}








$.fn.checkScrolling = function() {

	return this.each(function() {
		var el = $(this);

		//console.log(el[0].scrollWidth);
		//console.log(Math.ceil(el.innerWidth()));


		// Check if this is long enough to need scrolling
		if( el[0].scrollWidth > Math.ceil(el.innerWidth()) ) {
			el.marquee({
			    //speed in milliseconds of the marquee
			    duration: 10000,
			    //gap in pixels between the tickers
			    gap: 100,
			    //time in milliseconds before the marquee will start animating
			    delayBeforeStart: 5000,
			    pauseOnCycle: true,
			    //'left' or 'right'
			    direction: 'left',
			    //true or false - should the marquee be duplicated to show an effect of continues flow
			    duplicated: true,
			    startVisible: true
			});
	  };


	});
};
