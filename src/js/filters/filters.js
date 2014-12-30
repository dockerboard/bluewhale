(function () {
  'use strict';

  dockerboardApp.registerModule('dockerboard.filters');

  angular.module('dockerboard.filters')
    .filter('sanitize', ['$sce', function ($sce) {
      return function(htmlCode) {
        return htmlCode ? $sce.trustAsHtml(htmlCode + '') : '';
      };
    }])

    .filter('escape', ['$window', function ($window) {
      return function (url) {
        return $window.encodeURIComponent($window.encodeURIComponent(url));
      }
    }])

    .filter('unescape', ['$window', function ($window) {
      return function (url) {
        return url ? $window.decodeURIComponent($window.decodeURIComponent(url)) : '';
      }
    }])

    .filter('formatImageId', ['limitToFilter', function (limitToFilter) {
      var reg = /[\-\:\.\/_]/;

      return formatImageId;

      function formatImageId(id) {
        if (reg.exec(id)) {
          return id;
        }
        return limitToFilter(id, 12);
      }
    }]);

})();