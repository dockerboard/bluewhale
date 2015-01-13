(function () {
'use strict';

dockerboardApp.registerModule('system.ctrl');

angular.module('system.ctrl')
  .controller('SystemCtrl', SystemController)
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.
        state('system', {
          url: '/system',
          templateUrl: '/js/modules/system/views/system.tpl.html'
        });
    }
  ]);


SystemController.$inject = ['$scope', 'System'];
function SystemController($scope, System) {
  System.get(function (data) {
    $scope.system = data;
  });
}

})();
