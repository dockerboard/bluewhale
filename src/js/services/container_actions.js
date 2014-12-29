(function () {
'use strict';

angular.module('dockerboard.services')
  .factory('ContainerActions', ['$resource', function ($resource) {
    var res = $resource('/api/containers/:Id/:action', {
      Id: '@Id',
      action: '@action'
    }, {
      update: {
        method: 'POST'
      },
      logs: {
        method: 'GET',
        params: {
          action: 'logs'
        },
        transformResponse: function (data, headers) {
          return { text: data };
        },
        isArray: false
      }
    });
    res.logsQueryParams = {
      follow: false,
      stdout: true,
      stderr: false,
      timestamps: false,
      tail: 'all'
    };
    return res;
  }]);
})();
