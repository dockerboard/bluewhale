(function () {
'use strict';

dockerboardApp.registerModule('canvas');

angular.module('canvas')
  .controller('CanvasCtrl', CanvasController)
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.
        state('canvas', {
          url: '/canvas',
          templateUrl: '/js/modules/canvas/views/canvas.tpl.html'
        });
    }
  ]);


CanvasController.$inject = ['$scope', '$rootScope'];
function CanvasController($scope, $rootScope) {
  $scope.addNode = function () {
    alert('add node');
  };
}

})()
