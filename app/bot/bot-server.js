var tmi = require('tmi.js');

module.exports = function(twitchChannel){

  console.log('In Bot Server')
  console.log(twitchChannel);


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

    console.log(channel);
    switch(message){
      case '!song':
        console.log(currentTrack);

        text += currentTrack.name + ' - ' + currentTrack.artist;
        client.action(channel, text);
      break;
    }


  });

  return client;
};
