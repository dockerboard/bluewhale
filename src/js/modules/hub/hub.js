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

HubController.$inject = ['$scope', '$mdToast', '$mdDialog', 'Images'];
function HubController($scope, $mdToast, $mdDialog, Images) {

  $scope.queryParamsTerm = '';

  $scope.search = function (ev) {
    ev.preventDefault();
    if (!$scope.queryParamsTerm) {
      $mdToast.show(
        $mdToast.simple()
          .content('Please enter text for searching.')
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
    return false;
  };

  $scope.create = function (ev, image) {
    $mdDialog.show({
      controller: 'ImageCreateCtrl',
      templateUrl: '/js/modules/images/views/image.create.dialog.tpl.html',
      locals: { imageObject:  image},
      targetEvent: ev
    });
  };

}

})();
