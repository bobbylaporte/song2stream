var tmi = require('tmi.js');
var fs = require('fs');
var path = require('path');
var request=require('request');
var _ = require('lodash');
var moment = require('moment');


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

    console.log('channel');
    console.log(channel)

    console.log('twitch user');
    console.log(user);

    var isBroadcaster = (channel === '#'+ user.username);

    console.log('isBroadcaster?');
    console.log(isBroadcaster);

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

          var bot_settings = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/twitch_bot_settings.json'), 'utf8'));



          if(!bot_settings.requestsEnabled){

            var text = 'Song requests are closed.';
            client.action(channel, text);

          }else{

            var blacklist = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/song_blacklist.json'), 'utf8'));

            // Check if this user is a sub.
            // if(user.subscriber || user['badges-raw'].includes('broadcaster/1')){
            //   check if badges is an array first
            // if(user.subscriber){

            var spotifyUri = message.replace('!songrequest', '').replace(' ', '');
            var spotifyTrackId = spotifyUri.replace('spotify:track:', '');



            if((spotifyUri.match(/:/g) || []).length !== 2){
              text += '@' + user.username + ', I didn\'t recognize that Spotify URI. Get more info here: link';
              client.action(channel, text);
            }else{

              // Check Blacklist
              var blacklisted = _.filter(blacklist, function(o) { return spotifyUri === o.uri; });
              console.log('blacklietd???');
              console.log(blacklisted.length);
              if(blacklisted.length > 0){

                var json = blacklisted[0];
                var text = 'Nice try, @' + user.username + '. "' + json.name + ' - ' + json.artist + '" is a blacklisted song.';
                client.action(channel, text);

              }else{

                // TODO: Find this viewer in the viewer_list.json
                var viewerlist = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../data/viewers_list.json'), 'utf8'));
                var viewer = _.find(viewerlist, function(o) { return o.name === user.username; });

                console.log('THIS IS THE USER WHO IS TRYING TO FUCK SHIT UP!!!!!');
                console.log(viewer);

                if(viewer !== undefined || isBroadcaster){

                  if(isBroadcaster){
                    // Force broadcaster to always be allowed to request
                    viewer = { "name": user.username, "song_request_count": 99, "last_request_time" : "Wed, 28 Feb 2017 19:20:40 GMT"};
                  }

                  // Check that user has tokens
                  if(viewer.song_request_count > 0){
                    // Check that user has not requested within the last HOUR

                    var now = moment();
                    var duration = moment.duration(now.diff(viewer.last_request_time));
                    var hours_since_last_request = duration.asHours();


                    console.log('DIFFERENCE');
                    console.log(hours_since_last_request);






                    if(hours_since_last_request > 1 || isBroadcaster){
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

                          // Write this track info into the requested_tracks.json
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


                            text += '@' + user.username + ' has requested: ' + json.name + ' - ' + json.artists[0].name;
                            client.action(channel, text);


                            if(!isBroadcaster){
                              // TODO: remove token from user, and update last request time. Only remove if not broadcaster

                              // Find item index using indexOf+find
                              var index = _.indexOf(viewerlist, _.find(viewerlist, {name: viewer.name}));

                              viewer.song_request_count = viewer.song_request_count - 1;
                              viewer.last_request_time = new Date().toString();

                              // Replace item at index using native splice
                              viewerlist.splice(index, 1, viewer);

                              try {
                                fs.writeFileSync(path.join(__dirname, '/../../data/viewers_list.json'), JSON.stringify(viewerlist));
                                console.log('Updated Viewers List');
                                //io.emit('song_request_added');
                              } catch (err) {
                                console.log('Error writing viewerlist file');
                                console.log(err);
                              }
                            }



                          } catch (err) {
                            console.log('Error writing request to file');
                            console.log(err);

                            text += 'Oops! @' + user.username + ' that request failed. Please try again.';
                            client.action(channel, text);
                          }


                        }
                      });
                    }else{

                      // Time until next donation
                      var time_until_next_request = moment(viewer.last_request_time).add(1, 'hours').fromNow(true);

                      // Too Soon
                      var text = '@' + user.username + ', not so fast! You can only request one song per hour. Try again in about ' + time_until_next_request + '.';
                      client.action(channel, text);
                    }
                  }else{
                    // No Tokens
                    var text = '@' + user.username + ', You don\'t have any song request tokens. Continue to hang out in chat to earn more tokens.';
                    client.action(channel, text);
                  }

                }else{
                 // end viewer is undefined
                 var text = '@' + user.username + ', I don\'t see you in my records. Hang out in chat for a bit longer to earn your first token.';
                 client.action(channel, text);
                }

              } //end if not blacklisted

            } // end if didn't recognize
          } // end if requests are open
        } // end if contains !songrequest
      break;
    }// end switch


  });

  return client;
};
