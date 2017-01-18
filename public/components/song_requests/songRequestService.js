(function () {
  'use strict';

  function songRequestService($log, $q, ENV, $http, $filter, _, session, errorService, fileUpload) {

    return {

      getSongRequests: getSongRequests,
      addRequestToPlaylist: addRequestToPlaylist,
      removeSongRequest: removeSongRequest,

      startBotServer: startBotServer,

      getUserPreferences: getUserPreferences,
      saveUserPreferences: saveUserPreferences,

      checkForTwitchAuthFile: checkForTwitchAuthFile,
      checkForSpotifyAuthFile: checkForSpotifyAuthFile,

      getTrack: getTrack,

      logout: logout,
      connect: connect,

    };

    ////////////////////////////


    function getSongRequests() {
      return $q(function (resolve, reject) {
        $http.get('http://localhost:1337/api/get_song_requests').then(function (response) {

          var songs = response.data;

          console.log('song requests');
          console.log(songs);
          //var array = JSON.parse(songs);

          //$('ul.song-requests').html('');

          // array.forEach(function(track){
          //   var html =  '<li>';
          //         html += '<span class="track-detail">'+ track.name +' - '+ track.artist +'</span>';
          //         html += '<span class="requested-by">Requested by '+ track.requested_by +'</span>';
          //         html += '<a class="add-track" data-trackuri="'+ track.uri +'">ADD</a>';
          //         html += '<a class="remove-track" data-trackuri="'+ track.uri +'">REMOVE</a>';
          //       html += '</li>';

          //   $('ul.song-requests').append(html);
          // });

          resolve(songs);
        }).catch(function (err) {
          reject(err);
        });
      });
    }

    // function getSongRequest(id) {
    //   return $q(function (resolve, reject) {
    //     $http.get(ENV.BASE_URL + ENV.API_TOURNAMENTS + '/' + id).then(function (response) {
    //       var tournament = response.data;
    //       resolve(tournament);
    //     }).catch(function (err) {
    //       reject(err);
    //     });
    //   });
    // }

    function addRequestToPlaylist(uri) {
      var url = uri;
      return $q(function (resolve, reject) {
        $http.post('http://localhost:1337/api/add_track_to_playlist', { 'track': uri }).then(function (response) {
          var message = response.data;

          //console.log(message);
          switch(message){
            case 'success':
              console.log('added track to playlist. Now clear it away.');
              // Remove item from song request file at index $track.data('index')
              //removeSongRequest($track);
            break;
            case 'try_again':
              console.log('was not added. try again.');
              addRequestToPlaylist(url);
            break;
            case 'error':
            case 'failed':
              console.log('error requesting new token');
            break;
          }


          resolve(message);
        }).catch(function (err) {
          reject(err);
        });
      });
    }

    function removeSongRequest(uri) {
      return $q(function (resolve, reject) {

        $http.post('http://localhost:1337/api/remove_song_request', { 'track': uri }).then(function(response) {
          resolve(response.data);
        }).catch(function(err) {
          reject(err);
        });

      });
    }



    function startBotServer() {
      return $q(function (resolve, reject) {

        $http.get('http://localhost:1337/api/start_bot').then(function(response) {
          resolve(response.data);
        }).catch(function(err) {
          reject(err);
        });
      });
    }





    function getUserPreferences() {
      return $q(function (resolve, reject) {
        $http.get('http://localhost:1337/api/user_preferences').then(function (response) {

          var preferences = response.data;

          console.log('get preferences');
          console.log(preferences);

          resolve(preferences);
        }).catch(function (err) {
          reject(err);
        });
      });
    }

      //     $.ajax({
      //   method: "POST",
      //   url: "http://localhost:1337/api/user_preferences",
      //   data: $('form').serialize()
      // }).done(function( msg ) {
      //   console.log( "Data Saved: " + msg );

      // }).fail(function( jqXHR, textStatus ) {
      //   alert( "Error Saving: " + textStatus);
      // });

    function saveUserPreferences(formData) {
      return $q(function (resolve, reject) {
        $http.post('http://localhost:1337/api/user_preferences', formData ).then(function (response) {

          console.log('saved preferences');

          resolve(response);
        }).catch(function (err) {
          reject(err);
        });
      });
    }



    function checkForTwitchAuthFile(){
      return $q(function (resolve, reject) {
        $http.get('http://localhost:1337/api/check_twitch_auth_file').then(function (response) {
          resolve(response.data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }


    function checkForSpotifyAuthFile(){
      return $q(function (resolve, reject) {
        $http.get('http://localhost:1337/api/check_spotify_auth_file').then(function (response) {
          resolve(response.data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }

    function getTrack(){
      return $q(function (resolve, reject) {
        $http.get('http://localhost:1337/api/track').then(function (response) {
          resolve(response.data);
        }).catch(function (err) {
          reject(err);
        });
      });
    }

    function logout(service) {

      return $q(function (resolve, reject) {
        switch(service){
          case 'twitch':
            $http.post('http://localhost:1337/auth/twitch/delete_user').then(function (response) {
              resolve(response.data);
            }).catch(function (err) {
              reject(err);
            });
          break;
          case 'spotify':
            $http.post('http://localhost:1337/auth/spotify/delete_user').then(function (response) {
              resolve(response.data);
            }).catch(function (err) {
              reject(err);
            });
          break;
        }






      });




    }


    function connect() {
      return $q(function (resolve, reject) {

        $http.get('http://localhost:1337/api/connect').then(function(response) {
          resolve(response.data);
        }).catch(function(err) {
          reject(err);
        });
      });
    }

  }

  songRequestService.$inject = ['$log', '$q', 'ENV', '$http', '$filter', '_', 'session', 'errorService', 'Upload'];

  angular
    .module('uiApp')
    .service('songRequestService', songRequestService);
}());
