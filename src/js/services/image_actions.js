(function () {
'use strict';

angular.module('dockerboard.services')
  .factory('ImageActions', ['$resource', '$window', function ($resource, $window) {
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
      },
      push: {
        method: 'POST',
        params: {
          action: 'push'
        },
        // https://github.com/angular/angular.js/pull/10622
        transformRequest: function (data, headersGetter) {
          if (data) {
            var headers = headersGetter();
            var auth = {
              username: data.username || '',
              password: data.password || '',
              email: data.email || ''
            };
            if (auth.username && auth.password) {
              headers['Authorization'] = $window.btoa(JSON.stringify(auth));
              delete data.username;
              delete data.password;
            }
          }
        }
      }
    });
    console.dir(res);
    return res;
  }]);
})();
