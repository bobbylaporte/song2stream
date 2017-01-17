(function() {
  'use strict';

  angular.module('app.config', [])
    .constant('ENV', {

      BASE_URL: 'http://local.tournament:10000',

      // API Endpoints
      API_TOURNAMENTS: '/tournament',
      API_MATCHES: '/match',
      API_TEAMS: '/team',
      API_ASSETS: '/asset',
      API_INVITES: '/invite',
      API_USERS: '/user'
    });
})();
