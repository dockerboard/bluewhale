(function () {
  'use strict';

  angular.module('dockerboard.services')
    .factory('Images', ['$resource', function ($resource) {
      var res = $resource('/api/images/:Id', {
        Id: '@Id'
      }, {
        delete: {
          method: 'POST',
          headers: {
            'X-HTTP-Method-Override': 'DELETE'
          },
          params: {
            force: false,
            noprune: false
          }
        },
        search: {
          // hack
          params: {
            Id: 'search'
          },
          isArray: true
        },
        create: {
          method: 'POST',
          // hack
          params: {
            Id: ''
          }
        }
      });

      res.queryParams = {
        all: false,
        filters: ''
      };

      res.basicAttributes = [
        'Id',
        'Author',
        'Comment',
        'DockerVersion',
        'Architecture',
        'Os',
        'Size',
        'VirtualSize',
        'Created',
        'Parent'
      ];
      return res;
    }]);

})();
