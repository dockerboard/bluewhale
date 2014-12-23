(function () {
'use strict';

dockerboardApp.registerModule('board');

angular.module('board')
  .controller('BoardCtrl', BoardController)
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.
        state('board', {
          url: '/board',
          templateUrl: '/js/modules/board/views/board.tpl.html'
        });
    }
  ]);


BoardController.$inject = ['$scope', '$rootScope'];
function BoardController($scope, $rootScope) {
  $scope.addNode = function () {
    alert('add node');
  }
}

})()
