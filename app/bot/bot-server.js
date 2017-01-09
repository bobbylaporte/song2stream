var tmi = require('tmi.js');
var fs = require('fs');
var path = require('path');

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

    //console.log(channel);
    switch(message){
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
    }


  });

  return client;
};
