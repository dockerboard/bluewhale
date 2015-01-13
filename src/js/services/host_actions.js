(function () {
'use strict';

angular.module('dockerboard.services')
  .factory('HostActions', ['$resource', function ($resource) {
    var res = $resource('/api/hosts/:Id/:action', {
      Id: '@Id',
      action: '@action'
    }, {
      ping: {
        method: 'GET',
        params: {
          action: 'ping'
        },
        transformResponse: function (data) {
          return { text: data };
        },
        isArray: false
      }
    });
    return res;
  }]);
})();
