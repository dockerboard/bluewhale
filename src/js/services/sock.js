(function() {
  'use strict';

  angular.module('dockerboard.services')
    .factory('iSockPromise', ['$window', '$location', '$q', 'socketFactory', function($window, $location, $q, socketFactory) {
      var debug = $location.search('debug')
      var s = socketFactory({
        url: debug ? 'http://localhost:8001/ws' : location.origin + '/ws'
      });
      var deferred = $q.defer();
      s.setHandler('open', function() {
        deferred.resolve(s);
      });
      s.setHandler('close', function() {
        deferred.reject(s);
      });
      return deferred.promise;
    }]);
})();