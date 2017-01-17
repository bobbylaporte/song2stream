/**
 * @ngdoc function
 * @name offersUiApp.errorService
 * @description
 * # errorService
 * Controller to handle errors in the app with a modal.
 */

(function() {
  'use strict';

  function errorService($rootScope, $mdDialog, $log) {
    var errorThrown = false;

    var niceStrings = {
      7101: 'This campaign name has already been used, please choose another.',
      9034: 'This promotion name has already been used, please choose another.',
      9011: 'This promotion contains an SMS message with non-ascii characters, lease replace them.',
      segmentNotUnique: 'This segment name has already been used, please choose another.'
    };

    return {
      showError: showError,
      logError: logError
    };

    //////////////////////////////

    function stringForCode(errorObj) {
      var errorStrings = [];
      errorObj.forEach(function (err) {
        var errorString = niceStrings[err.code] ? niceStrings[err.code] : err.title;
        if (errorString) {
          errorStrings.push(errorString);
        }
      });

      if (errorStrings.length === 1) {
        return errorStrings[0];
      } else {
        return errorStrings;
      }
    }

    function logError(error) {
      $log.error(error);
    }

    /**
     * @ngdoc function
     * @name showError
     * @param errorString - A text string to display within the modal
     * @param errorResponse - An array of objects with code/title keys
     * @param modalConfig - An array of objects for configuring the modal.
     *          title: Specify the title for the modal. Defaults to "Error".
     * @description showError will display a modal showing an error message. The
     *   error is one of: errorString, the title (message) returned by the backend
     *   if the code does not match a niceString above, or the niceString that matches
     *   one of the codes above.
     */
    function showError(error) {

      var alert = $mdDialog.alert({
        title: error.data.title ? error.data.title : 'Error',
        ok: 'OK',
        clickOutsideToClose: true
      });

      alert.textContent(error.data.message);

      $mdDialog.show(alert);

    }
  }

  errorService.$inject = ['$rootScope', '$mdDialog', '$log'];

  angular
    .module('uiApp')
    .factory('errorService', errorService);
}());
