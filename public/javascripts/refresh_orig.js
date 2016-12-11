// window.setTimeout(function(){
// 	location.reload();
// }, 4000);


var config = {};
var currentTrack = { name: '', artist: '' };
var offline = true;

var fetchTimer;
var autoHideTimer;

$(document).ready(function(){

	var socket = io('http://localhost:1337');

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


			console.log('user preferences set');
			// Get track Via AJAX
			socket.emit('get_track_info');
			socket.on('update_track', function(message){
				console.log(message);
			});


		
		}).fail(function( jqXHR, textStatus ) {
			
			// If text2status is down, it's no good at all. This will never happen
			console.log('failed to get preferences');
		});


	}

	
});




function fetch(){
	console.log('call that shit fucker');
	$.ajax({
	  url: "http://localhost:1337/api/track"
	}).done(function(response) {

		console.log('response from fetch');
		console.log(response);

		offline = false;

		if(currentTrack.name === '' || (response.name !== currentTrack.name)){


		  	$( '.card' ).addClass(config.animation_type);

			setTimeout(function(){
				currentTrack.name = response.name;
				currentTrack.artist = response.artist;
				currentTrack.playing = response.playing;

				$('.name').text(response.name);
				$('.artist').text(response.artist);

				$('.card').removeClass(config.animation_type);


				setTimeout(function(){

					$('.name').checkScrolling();

					clearTimeout(fetchTimer);
				  	fetchTimer = setTimeout(function(){
					  	fetch();
					  }, 2000);


				  	if(config.auto_hide > 0){
				  		clearTimeout(autoHideTimer);
				  		autoHideTimer = setTimeout(function(){
						  	$( '.card' ).addClass(config.animation_type);
						 }, config.auto_hide * 1000);
				  	}


				}, 800);


			}, 800);
				



	  	



		}else{

			clearTimeout(fetchTimer);
		 	fetchTimer = setTimeout(function(){
		  		fetch();
		  	}, 2000);
		}


	}).fail(function( jqXHR, textStatus ) {


		console.log('failed');
		console.log('offline?');
		console.log(offline);

		if(!offline){





			// Animate Card out and then
			$( '.card' ).addClass(config.animation_type);

			setTimeout(function(){
				

				currentTrack.name = null;
				currentTrack.artist = null;
				currentTrack.playing = null;

				$('.name').show('Offline');
				$('.artist').text('Spotify Not Detected');

				$('.card').removeClass(config.animation_type);


				setTimeout(function(){

					$('.name').checkScrolling();
					$('.artist').checkScrolling();

				  	clearTimeout(fetchTimer);
				  	fetchTimer = setTimeout(function(){
					  	fetch();
					  }, 2000);


				}, 800);


			}, 800);
		}else{


			offline = true;
			// go offline

			clearTimeout(fetchTimer);
		  	fetchTimer = setTimeout(function(){
			  	fetch();
			  }, 10000);
		}


	});
}









$.fn.checkScrolling = function() {

	return this.each(function() {
		var el = $(this);

		console.log(el[0].scrollWidth);
		console.log(Math.ceil(el.innerWidth()));


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