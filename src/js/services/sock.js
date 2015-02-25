(function () {
'use strict';

angular.module('dockerboard.services')
  .factory('iSockPromise', ['$window', '$q', 'socketFactory', function ($window, $q, socketFactory) {
    var s = socketFactory({
      url: location.origin + '/ws'
    });
    var deferred = $q.defer();
    s.setHandler('open', function () {
      deferred.resolve(s);
    });
    s.setHandler('close', function () {
      deferred.reject(s);
    });
    return deferred.promise;
  }]);
})();