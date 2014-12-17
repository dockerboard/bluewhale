(function () {
'use strict';

dockerboardApp.registerModule('site.component');

angular.module('site.component')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.
        state('site', {
          url: '/',
          templateUrl: '/js/modules/site/views/index.tpl.html'
        })
    }
  ]);
})();
