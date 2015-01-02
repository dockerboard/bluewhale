(function () {
'use strict';

angular.module('dockerboard.services')
  .factory('Containers', ['$resource', function ($resource) {
    var res = $resource('/api/containers/:Id', {
      Id: '@Id'
    }, {
      delete: {
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'DELETE'
        },
        params: {
          force: false,
          v: false
        }
      }
    });

    res.queryParams = {
      all: false,
      limit: '',
      size: false,
      since: '',
      before: '',
      filters: ''
    };

    res.basicAttributes = [
      'Id',
      'Name',
      'Created',
      'Image'
    ];
    return res;
  }]);
})();
