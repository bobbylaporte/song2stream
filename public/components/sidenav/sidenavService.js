(function () {
  'use strict';

  function sidenavService($mdSidenav) {

    return {
      toggleNav: toggleNav
    };

    ////////////////////////////


    function toggleNav(options) {
      $mdSidenav('left')
        .toggle()
        .then(function () {
          // Toggle done
        });
    }



  }

  sidenavService.$inject = ['$mdSidenav'];

  angular
    .module('uiApp')
    .service('sidenavService', sidenavService);
}());
