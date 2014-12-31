(function () {
'use strict';

angular.module('dockerboard.services')
  .factory('Hosts', ['$resource', function ($resource) {
    var res = $resource('/api/hosts/:Id', {
      Id: '@Id'
    }, {
      delete: {
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'DELETE'
        }
      },
      save: {
        method: 'POST'
      }
    });
    res.CurrentHost = null;
    res.getCurrentHostUrl = function (h) {
      h = h || res.CurrentHost;
      return h && (h.URL.Scheme + '://' + h.URL.Host);
    }
    return res;
  }]);
})();
