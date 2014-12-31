(function () {
'use strict';

dockerboardApp.registerModule('containers.ctrl');

angular.module('containers.ctrl')
  .controller('ContainersCtrl', ContainersController)
  .controller('ContainerCtrl', ContainerController)
  .controller('ContainerLogsCtrl', ContainerLogsController)
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
        })
        .state('containerLogs', {
          url: '/containers/{Id}/logs',
          templateUrl: '/js/modules/containers/views/container.logs.tpl.html'
        });
    }
  ]);

ContainersController.$inject = ['$scope', 'Containers', 'Hosts'];
function ContainersController($scope, Containers, Hosts) {

  $scope.queryParams = angular.copy(Containers.queryParams);
  $scope.queryParams.host = Hosts.getCurrentHostUrl()

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

ContainerController.$inject = ['$scope', '$stateParams', '$location', '$mdDialog', 'limitToFilter', 'amTimeAgoFilter', 'Containers', 'Hosts'];
function ContainerController($scope, $stateParams, $location, $mdDialog, limitToFilter, amTimeAgoFilter, Containers, Hosts) {
  Containers.get({Id: $stateParams.Id, host: Hosts.getCurrentHostUrl()}, function (data) {
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
        v = amTimeAgoFilter(v, true);
      }

      this.push({
        key: k,
        value: v
      });
    }, $scope.basicAttributes);
  }

  $scope.toggleRunning = function (ev) {
    $mdDialog.show({
      controller: RunningDialogController,
      templateUrl: '/js/modules/containers/views/container.running.dialog.tpl.html',
      locals: { parentScope: $scope },
      targetEvent: ev,
    })
    .then(function (running) {
      $scope.container.State.Running = running;
      $scope.container.State[running ? 'StartedAt' : 'FinishedAt'] = Date.now();
    });
  };

  $scope.togglePaused = function (ev) {
    $mdDialog.show({
      controller: PausedDialogController,
      templateUrl: '/js/modules/containers/views/container.paused.dialog.tpl.html',
      locals: { parentScope: $scope },
      targetEvent: ev,
    })
    .then(function (paused) {
      $scope.container.State.Paused = paused;
    });
  };

  $scope.destory = function (ev) {
    $mdDialog.show({
      controller: DestoryDialogController,
      templateUrl: '/js/modules/containers/views/container.destory.dialog.tpl.html',
      locals: { parentScope: $scope },
      targetEvent: ev,
    });
  };

}

DestoryDialogController.$inject = ['$scope', '$location', '$mdDialog', 'Containers', 'parentScope'];
function DestoryDialogController($scope, $location, $mdDialog, Containers, parentScope) {
  $scope.container = parentScope.container;
  $scope.containerShortId = parentScope.containerShortId;

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
      {
        Id: $scope.containerShortId,
        force: $scope.params.force,
        v: $scope.params.v
      },
      null,
      function (data) {
        $mdDialog.hide();
        $location.path('/containers');
      },
      function (e) {
        if (e.status === 404) {
          $mdDialog.hide();
          $location.path('/containers');
          return;
        }
        $scope.content = e.data;
      }
    );
  };
}

RunningDialogController.$inject = ['$scope', '$location', '$mdDialog', 'parentScope', 'ContainerActions'];
function RunningDialogController($scope, $location, $mdDialog, parentScope, ContainerActions) {
  $scope.container = parentScope.container;
  $scope.action = parentScope.container.State.Running ? 'stop' : 'start';
  $scope.isRestart = false;
  $scope.containerShortId = parentScope.containerShortId;

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.params = {
    t: ''
  };

  $scope.change = function (isRestart) {
    if (isRestart) {
      $scope.preAction = $scope.action;
      $scope.action = 'restart';
    } else {
      $scope.action = $scope.preAction;
    }
  };

  $scope.content = '';

  $scope.ok = function () {
    ContainerActions.update({
      Id: $scope.containerShortId,
      action: $scope.action
    }, $scope.params, function (data) {
      var running =  !$scope.container.State.Running;
      if ($scope.action == 'restart') {
        running = true;
      }
      $mdDialog.hide(running);
    }, function (e) {
      if (e.status === 304) {
        var running =  !$scope.container.State.Running;
        $mdDialog.hide(running);
      } else {
        $scope.content = e.data;
      }
    });
  };
}

PausedDialogController.$inject = ['$scope', '$location', '$mdDialog', 'parentScope', 'ContainerActions'];
function PausedDialogController($scope, $location, $mdDialog, parentScope, ContainerActions) {
  $scope.container = parentScope.container;
  $scope.action = parentScope.container.State.Paused ? 'unpause' : 'pause';
  $scope.isRestart = false;
  $scope.containerShortId = parentScope.containerShortId;

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.content = '';

  $scope.ok = function () {
    ContainerActions.update({
      Id: $scope.containerShortId,
      action: $scope.action
    }, function (data) {
      var paused = !$scope.container.State.Paused;
      $mdDialog.hide(paused);
    }, function (e) {
      $scope.content = e.data;
    });
  };
}

ContainerLogsController.$inject = ['$scope', '$stateParams', 'ContainerActions'];
function ContainerLogsController($scope, $stateParams, ContainerActions) {
  $scope.containerShortId = $stateParams.Id;
  $scope.queryParams = ContainerActions.logsQueryParams;

  $scope.fetch = function (Id, queryParams) {
    var params = angular.copy(queryParams, {});
    params.Id = Id;
    ContainerActions.logs(params, function (data) {
      $scope.logs = data.text || '';
    })
  };

  $scope.fetch($scope.containerShortId, $scope.queryParams);

  $scope.search = function () {
    $scope.fetch($scope.containerShortId, $scope.queryParams);
  };

  $scope.scrollToEnd = function ($ev) {
    var logContent = angular.element($ev.currentTarget).parent().parent()[0];
    if (logContent) {
      logContent.scrollTop = logContent.scrollHeight;
    }
  };
}

})();
