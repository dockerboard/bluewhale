(function () {
'use strict';

dockerboardApp.registerModule('hub.ctrl');

angular.module('hub.ctrl')
  .controller('HubCtrl', HubController)
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.
        state('hub', {
          url: '/hub',
          templateUrl: '/js/modules/hub/views/hub.tpl.html'
        });
    }
  ]);

HubController.$inject = ['$scope', '$mdToast', 'Images'];
function HubController($scope, $mdToast, Images) {

  $scope.queryParamsTerm = '';

  $scope.search = function () {
    if (!$scope.queryParamsTerm) {
      $mdToast.show(
        $mdToast.simple()
          .content("Please enter text for searching.")
          .position('top right')
          .action('Close')
          .hideDelay(1500)
      );
      return;
    }
    Images.search(
      {
        term: $scope.queryParamsTerm
      },
      function (data) {
        $scope.images = data;
      },
      function (d) {
        $mdToast.show(
          $mdToast.simple()
            .content(d.data)
            .position('top right')
            .action('Close')
            .hideDelay(1500)
        );
      }
    );
  };

}

})();
