var tmi = require('tmi.js');
var fs = require('fs');
var path = require('path');
var request=require('request');

module.exports = function(twitchChannel, io){

  console.log('In Bot Server')
  console.log(twitchChannel);

  var currentStatus;

  var options = {
    options: {
      debug: true
    },
    connection: {
      cluster: 'aws',
      reconnect: true
    },
    identity: {
      username: 'song2stream',
      password: 'oauth:zu8vdpoalyynyjadrech2thc1rekmq'
    },
    channels: [twitchChannel] // This should be array of all twitch channels that want this bot
  };

  var client = new tmi.client(options);
  client.connect();


  client.on('connected', function (address, port) {
      console.log('connected');
      console.log('address: ' + address);
      console.log('port: ' + port);

       //io.emit('bot_connected');
       console.log('connecting bot from inside server');
       io.sockets.emit('bot_connected');

  });



  client.on("join", function (channel, username, self) {
      if(username === 'bracketsbot'){
        client.action(channel, 'I just updated!');
        //client.action(channel, '/color OrangeRed');
      }
  });


  //
  //
  // All responses
  //
  //


  client.on('chat', function(channel, user, message, self){

    var text = '';

    console.log('twitch user');
    console.log(user);

    // twitch user
    // { badges: { broadcaster: '1', premium: '1' },
    //   color: '#0000FF',
    //   'display-name': 'ominoustoad',
    //   emotes: null,
    //   id: 'ccdcfe16-1326-4ce6-be21-76af99227885',
    //   mod: false,
    //   'room-id': '84465033',
    //   'sent-ts': '1483724950506',
    //   subscriber: false,
    //   'tmi-sent-ts': '1483724950654',
    //   turbo: false,
    //   'user-id': '84465033',
    //   'user-type': null,
    //   'emotes-raw': null,
    //   'badges-raw': 'broadcaster/1,premium/1',
    //   username: 'ominoustoad',
    //   'message-type': 'chat' }

    //console.log(channel);
    switch(message){
      case '!song2stream':
        // Return Help Text about song2stream
        //text += currentTrack.link;
        //client.action(channel, text);
      break;

      case '!song':
        //console.log(currentTrack);

        try {
          currentStatus = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/spotify_status.json'), 'utf8'));
          console.log('currentStatus set');
          console.log(currentStatus);

          text += currentStatus.track.track_resource.name + ' - ' + currentStatus.track.artist_resource.name ;
          client.action(channel, text);
        } catch (err) {
          console.log('Error Reading Status File');
          console.log(err);

          text += 'No Song Playing';
          client.action(channel, text);
        }



      break;

      case '!songlink':

        try {
          currentStatus = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/spotify_status.json'), 'utf8'));
          console.log('currentStatus set');
          console.log(currentStatus);

          text += currentStatus.track.track_resource.location.og;
          client.action(channel, text);
        } catch (err) {
          console.log('Error Reading Status File');
          console.log(err);
        }


      break;


      default:
        // Check if message contains '!songrequest'
        if(message.includes('!songrequest')){
          // Check if this user is a sub.
          //if(user.subscriber || user['badges-raw'].includes('broadcaster/1')){
            //check if badges is an array first
          //if(user.subscriber){

            var spotifyUri = message.replace('!songrequest', '').replace(' ', '');
            var spotifyTrackId = spotifyUri.replace('spotify:track:', '');

            //TODO: What is the track name of this
            /// GET reeust for

            request.get('https://api.spotify.com/v1/tracks/'+ spotifyTrackId, options, function(err,res,body){

              if(err){
                console.log('error finding requested spotify song details');
                console.log(err);
                text += '@' + user.username + ', I didn\'t recognize that Spotify URI. Get more info here: link';
                client.action(channel, text);
              }

              if(!err){
                // Success! We have a track.

                var json = JSON.parse(body);

                text += '@' + user.username + ' has requested: ' + json.name + ' - ' + json.artists[0].name;
                client.action(channel, text);

                // TODO: Write this track info into the requested_tracks.json
                var new_track = { name: json.name, artist: json.artists[0].name, id: spotifyTrackId, uri: spotifyUri, requested_by: user.username};



                // Open existing requested Tracks if be have one, or create one.
                var requests_array;

                try {
                  requests_array = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/requested_tracks.json'), 'utf8'));
                  console.log('Read Requests File');

                } catch (err) {
                  console.log('Error Reading Requests File... Writing New File');
                  console.log(err);

                  fs.writeFileSync(path.join(__dirname, '/../../data/requested_tracks.json'), JSON.stringify([]));

                  // Now read it back.
                  requests_array = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/requested_tracks.json'), 'utf8'));
                }


                requests_array.push(new_track);
                try {
                  fs.writeFileSync(path.join(__dirname, '/../../data/requested_tracks.json'), JSON.stringify(requests_array));
                  console.log('Wrote new Request to File');
                  io.emit('song_request_added');
                } catch (err) {
                  console.log('Error writing request to file');
                  console.log(err);
                }


              }
            });

          //}else{
            //text += '@' + user.username + ', only subscribers can request songs.'
            //client.action(channel, text);
          //}
        }
      break;
    }


  });

  return client;
};
