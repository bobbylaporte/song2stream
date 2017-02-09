/**
 * @ngdoc overview
 * @name uiApp
 * @description
 * # uiApp
 *
 * Main module of the application.
 */

(function() {
  'use strict';

  angular
    .module('uiApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngMessages',

      // 3rd Party
      'angular-cache',
      'ngMaterial',
      'ngFileUpload',
      'btford.socket-io',
      'ngMaterialDatePicker',
      'angulartics',
      'angulartics.google.analytics',
      'ui.ace',
      'angularMoment',
      // 'moment-picker',
      // 'angular-notification-icons',

      // config
      'app.config'
    ])
    .value('session', {
      alerts: [],
      user: {},
      clients: [],
      currentClient: {},
      currentClientChannels: []
    })
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          redirectTo: '/user/dashboard'
        })
        .when('/user/dashboard', {
          templateUrl: 'components/dashboard/dashboardView.html',
          controller: 'DashboardController',
          controllerAs: 'dashboardCtrl'
        })
        .when('/user/invites', {
          templateUrl: 'components/invite/invitesView.html',
          controller: 'InvitesController',
          controllerAs: 'invitesCtrl'
        })
        .when('/login', {
          templateUrl: 'components/login/loginView.html',
          controller: 'LoginController',
          controllerAs: 'loginCtrl'
        })
        .when('/user/tournaments', {
          templateUrl: 'components/tournament/tournamentListView.html',
          controller: 'TournamentListController',
          controllerAs: 'listCtrl'
        })
        .when('/tournament/:id', {
          templateUrl: 'components/tournament/tournamentDetailView.html',
          controller: 'TournamentDetailController',
          controllerAs: 'detailCtrl'
        })
        .when('/tournament/:id/edit', {
          templateUrl: 'components/tournament/tournamentFormView.html',
          controller: 'TournamentFormController',
          controllerAs: 'formCtrl'
        })
        .when('/tournament/:id/bracket', {
          templateUrl: 'components/bracket/bracketView.html',
          controller: 'BracketViewController',
          controllerAs: 'bracketCtrl'
        })
        .when('/tournament/:id/register', {
          templateUrl: 'components/register/registerView.html',
          controller: 'RegisterViewController',
          controllerAs: 'registerCtrl'
        })
        .when('/tournament/:id/checkin', {
          templateUrl: 'components/checkin/checkinView.html',
          controller: 'CheckinViewController',
          controllerAs: 'checkinCtrl'
        })
        .when('/tournament/:id/match/:match_id', {
          templateUrl: 'components/tournament/match/matchDetailView.html',
          controller: 'MatchDetailController',
          controllerAs: 'detailCtrl'
        })
        .when('/tournaments/featured/:activity?', { // PUBLIC
          templateUrl: 'components/tournaments_public/featuredTournamentsView.html',
          controller: 'FeaturedTournamentsController',
          controllerAs: 'ctrl'
        })
        .when('/tournaments/find/:activity?', { // PUBLIC
          templateUrl: 'components/tournaments_public/findTournamentsView.html',
          controller: 'FindTournamentsController',
          controllerAs: 'ctrl'
        })
        .when('/user/profile/:id', {
          templateUrl: 'components/user/userProfileView.html',
          controller: 'UserProfileController',
          controllerAs: 'userCtrl'
        })
        .when('/user/teams', {
          templateUrl: 'components/team/teamListView.html',
          controller: 'TeamListController',
          controllerAs: 'listCtrl'
        })
        .when('/team/:id', {
          templateUrl: 'components/team/teamDetailView.html',
          controller: 'TeamDetailController',
          controllerAs: 'detailCtrl'
        })
        .when('/team/:id/edit', {
          templateUrl: 'components/team/teamFormView.html',
          controller: 'TeamFormController',
          controllerAs: 'formCtrl'
        })
        .when('/user/matches', {
          templateUrl: 'components/user/matches/userMatchesView.html',
          controller: 'UserMatchesController',
          controllerAs: 'listCtrl'
        })
        .otherwise({
          redirectTo: '/login'
        });
    }).config(function($provide) {
      // Surprisingly difficult to inject $window into a constant using the function definition.
      $provide.constant('ga', window.ga); // eslint-disable-line
      $provide.constant('_', window._); // eslint-disable-line
      $provide.constant('moment', window.moment); // eslint-disable-line
      $provide.constant('$', window.$); // eslint-disable-line
    })
    .config(function (CacheFactoryProvider) {
      angular.extend(CacheFactoryProvider.defaults, {
        maxAge: 60 * 60 * 1000, // 1 hour
        deleteOnExpire: 'aggressive'
      });
    }).config(function($mdThemingProvider) {
      // Configure theme
      $mdThemingProvider.theme('default')
         .accentPalette('blue')
         .warnPalette('red');
  });

  //angular.module('uiAppMocks', []);
})();
