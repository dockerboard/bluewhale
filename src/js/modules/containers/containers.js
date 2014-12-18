(function () {
'use strict';

dockerboardApp.registerModule('containers.ctrl');

angular.module('containers.ctrl')
  .controller('ContainersCtrl', ContainersController)
  .controller('ContainerCtrl', ContainerController)
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.
        state('containers', {
          url: '/containers',
          templateUrl: '/js/modules/containers/views/containers.tpl.html'
        })
        .state('containeritem', {
          url: '/containers/:Id',
          templateUrl: '/js/modules/containers/views/container.tpl.html'
        });
    }
  ]);

ContainersController.$inject = ['$scope', 'Containers'];
function ContainersController($scope, Containers) {

  $scope.queryParams = Containers.queryParams;

  $scope.fetch = function () {
    Containers.query($scope.queryParams, function (data) {
      $scope.containers = data;
    });
  };

  $scope.fetch();

  $scope.search = function () {
    $scope.fetch();
  };
}

ContainerController.$inject = ['$scope', '$stateParams', '$location', '$mdDialog', 'limitToFilter', 'dateFilter', 'Containers'];
function ContainerController($scope, $stateParams, $location, $mdDialog, limitToFilter, dateFilter, Containers) {
  Containers.get({Id: $stateParams.Id}, function (data) {
    formatBasicAttributes(data);
    $scope.container = data;
    $scope.containerShortId =  limitToFilter(data.Id, 12);
  }, function (e) {
    if (e.status === 404) {
      $location.path('/containers');
    }
  });

  $scope.basicAttributes = [];

  function formatBasicAttributes(container) {
    angular.forEach(Containers.basicAttributes, function (k) {
      var v = container[k];
      if (k === 'Id' || k === 'Image') {
        v = limitToFilter(v, 12);
        var href = '#/';
        href += (k === 'Id' ? 'containers/' : 'images/') + v;
        v = '<a ng-href="' + href + '" href="' + href + '">' + v + '</a>';
      } else if (k === 'Created') {
        v = dateFilter(v, 'yyyy-MM-dd HH:mm:ss Z');
      }

      this.push({
        key: k,
        value: v
      });
    }, $scope.basicAttributes);
  }

  $scope.destory = function (ev) {
    $mdDialog.show({
      controller: DestoryDialogController,
      templateUrl: '/js/modules/containers/views/container.destory.dialog.tpl.html',
      locals: { container: $scope.container, containerShortId: $scope.containerShortId },
      targetEvent: ev,
    });
  };

}

DestoryDialogController.$inject = ['$scope', '$location', '$mdDialog', 'Containers', 'container', 'containerShortId'];
function DestoryDialogController($scope, $location, $mdDialog, Containers, container, containerShortId) {
  $scope.container = container;
  $scope.containerShortId = containerShortId;

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.params = {
    force: false,
    v: false
  };

  $scope.content = '';

  $scope.ok = function () {
    Containers.delete(
      { Id: $scope.containerShortId },
      $scope.params,
      function (data) {
        $mdDialog.hide();
        $location.path('/containers');
      },
      function (e) {
        $scope.content = e.data;
      }
    );
  };
}
})();
