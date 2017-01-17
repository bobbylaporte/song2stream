(function() {
  'use strict';

  function sidenavDirective(authService, $mdSidenav, $location, $window, ENV, $cookies) {
    return {
      templateUrl: 'components/sidenav/sidenavView.html',
      scope: {
      },
      link: function ($scope) {
        $scope.isLoggedIn = authService.isLoggedIn();

        if($scope.isLoggedIn){
          $scope.userName = JSON.parse($cookies.get('user')).name;
          $scope.userId = JSON.parse($cookies.get('user'))._id;
          $scope.userProfilePath = '/user/profile/' + $scope.userId;
        }


        $scope.navigateTo = function(path){
          $mdSidenav('left')
              .toggle()
              .then(function () {
                console.log(path);
                $location.path(path);
              });
        };

        $scope.login = function(type){
          window.location = ENV.BASE_URL + '/user/auth/' + type;
        };

        $scope.logout = function(){
          authService.logOut();
          $scope.$broadcast('user-logout');
        };

        $scope.openMenu = function($mdOpenMenu, ev) {
          //originatorEv = ev;
          $mdOpenMenu(ev);
        };

        $scope.$on('user-logout', function() {
          $scope.isLoggedIn = authService.isLoggedIn();
        });




      }
    };
  }

  sidenavDirective.$inject = ['authService', '$mdSidenav', '$location', '$window', 'ENV', '$cookies'];

  angular.module('uiApp')
    .directive('sidenavDirective', sidenavDirective);

})();
