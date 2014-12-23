(function () {
'use strict';

angular.module('dockerboard.services')
  .factory('ImageActions', ['$resource', function ($resource) {
    var res = $resource('/api/images/:Id/:action', {
      Id: '@Id',
      action: '@action'
    }, {
      update: {
        method: 'POST'
      },
      history: {
        params: {
          action: 'history'
        },
        isArray: true
      }
    });
    return res;
  }]);
})();
