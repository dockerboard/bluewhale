(function () {
'use strict';

angular.module('dockerboard.services')
  .factory('System', ['$resource', function ($resource) {
    var res = $resource('/api/system');
    return res;
  }]);
})();
