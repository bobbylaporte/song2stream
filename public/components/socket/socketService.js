'use strict';
angular.module('uiApp')
.factory('socket', function (socketFactory, ENV) {
    var newIO = io.connect('http://localhost:1337');
    var socket = socketFactory({
      ioSocket: newIO
    });
    return socket;
});
