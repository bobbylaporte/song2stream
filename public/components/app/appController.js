/**
 * @ngdoc function
 * @name uiApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Global controller for global events
 */

(function () {

  'use strict';

  function AppController($rootScope, $log, $location, authService, ga, session) {

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      $log.log('Route change error! ' + rejection);
    });

    $rootScope.$on('$locationChangeStart', function(evt, next) {

      if($location.search().user){
        var user = JSON.parse($location.search().user);
        $location.search('user', null);
        authService.setToken(user.access_token);
        delete user.access_token;
        authService.setUser(JSON.stringify(user));
      }


      var route = next.split('#');
      route = route.pop();

      //ga('send', 'pageview', route);

      if (route.indexOf('login') < 0 &&
          route.indexOf('forgotpassword') < 0 &&
          route.indexOf('resetpassword') < 0 &&
          route.indexOf('styleguide') < 0 &&
          route.indexOf('browser') < 0) {
        // if (!authService.checkCreds()) {
        //   //authService.redirectToLogin();
        //   return;
        // }
      }

      if (route.indexOf('consumers') >= 0 && !session.currentClient.detail.consumerProfiles) {
        evt.preventDefault();
      }
    });
  }

  AppController.$inject = ['$rootScope', '$log', '$location', 'authService', 'ga', 'session'];

  angular.module('uiApp')
    .controller('AppController', AppController);

})();
