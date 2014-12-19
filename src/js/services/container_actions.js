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
        }
      });
      return res;
    }]);

})();
