(function() {
  'use strict';

  dockerboardApp.registerModule('containers.ctrl');

  angular.module('containers.ctrl')
    .controller('ContainersCtrl', ContainersController)
    .controller('ContainerCtrl', ContainerController)
    .controller('ContainerLogsCtrl', ContainerLogsController)
    .controller('ContainerTopCtrl', ContainerTopController)
    .config(['$stateProvider',
      function($stateProvider) {
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
          })
          .state('containerTop', {
            url: '/containers/{Id}/top',
            templateUrl: '/js/modules/containers/views/container.top.tpl.html'
          });
      }
    ]);

  ContainersController.$inject = ['$scope', 'Containers', 'Hosts'];

  function ContainersController($scope, Containers, Hosts) {

    $scope.queryParams = Containers.queryParams;
    $scope.queryParams.host = Hosts.getCurrentHostUrl();

    $scope.queryParamsFilters = '';

    $scope.fetch = function() {
      $scope.queryParams.filters = parseFilters($scope.queryParamsFilters);
      Containers.query($scope.queryParams, function(data) {
        $scope.containers = data;
      });
    };

    $scope.fetch();

    $scope.search = function() {
      $scope.fetch();
    };

    $scope.displayablePorts = function(ports) {
      var result = [];
      for (var i = 0, l = ports.length; i < l; ++i) {
        var port = ports[i];
        if (port.IP === '') {
          result.push(port.PrivatePort + '/' + port.Type);
        } else {
          result.push(port.IP + ':' + port.PublicPort + '->' + port.PrivatePort + '/' + port.Type);
        }
      }
      return result.join(', ');
    };

    function parseFilters(text) {
      if (!text) return '';
      var filters = {};
      var arr = text.split(/\s+/g);
      for (var i = 0, l = arr.length; i < l; ++i) {
        var f = arr[i].split('=');
        if (f.length !== 2) {
          continue;
        }
        var name = f[0];
        var value = f[1];
        if (name && value) {
          filters[name] = filters[name] || [];
          filters[name].push(value);
        }
      }
      return JSON.stringify(filters);
    }
  }

  ContainerController.$inject = ['$scope', '$stateParams', '$location', '$mdDialog', 'limitToFilter', 'amTimeAgoFilter', 'Containers', 'Hosts', 'ContainerActions', 'iSockPromise'];

  function ContainerController($scope, $stateParams, $location, $mdDialog, limitToFilter, amTimeAgoFilter, Containers, Hosts, ContainerActions, iSockPromise) {
    iSockPromise.then(function(sock) {
      var data = {
        type: 'container',
        endpoint: 'stats',
        id: $stateParams.Id
      };
      sock.send(JSON.stringify(data));
    });

    Containers.get({
      Id: $stateParams.Id,
      host: Hosts.getCurrentHostUrl()
    }, function(data) {
      formatBasicAttributes(data);
      $scope.container = data;
      $scope.containerShortId = limitToFilter(data.Id, 12);
    }, function(e) {
      if (e.status === 404) {
        $location.path('/containers');
      }
    });

    ContainerActions.get({
      Id: $stateParams.Id,
      action: 'stats'
    }, function(data) {
      console.dir(data);
    });

    $scope.basicAttributes = [];

    function formatBasicAttributes(container) {
      angular.forEach(Containers.basicAttributes, function(k) {
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

    $scope.toggleRunning = function(ev) {
      $mdDialog.show({
          controller: RunningDialogController,
          templateUrl: '/js/modules/containers/views/container.running.dialog.tpl.html',
          locals: {
            parentScope: $scope
          },
          targetEvent: ev,
        })
        .then(function(running) {
          $scope.container.State.Running = running;
          $scope.container.State[running ? 'StartedAt' : 'FinishedAt'] = Date.now();
        });
    };

    $scope.togglePaused = function(ev) {
      $mdDialog.show({
          controller: PausedDialogController,
          templateUrl: '/js/modules/containers/views/container.paused.dialog.tpl.html',
          locals: {
            parentScope: $scope
          },
          targetEvent: ev,
        })
        .then(function(paused) {
          $scope.container.State.Paused = paused;
        });
    };

    $scope.destory = function(ev) {
      $mdDialog.show({
        controller: DestoryDialogController,
        templateUrl: '/js/modules/containers/views/container.destory.dialog.tpl.html',
        locals: {
          parentScope: $scope
        },
        targetEvent: ev,
      });
    };

    $scope.kill = function(ev) {
      $mdDialog.show({
          controller: KillDialogController,
          templateUrl: '/js/modules/containers/views/container.kill.dialog.tpl.html',
          locals: {
            parentScope: $scope
          },
          targetEvent: ev,
        })
        .then(function(running) {
          $scope.container.State.Running = running;
          $scope.container.State.Pid = 0;
        });
    };
  }

  DestoryDialogController.$inject = ['$scope', '$location', '$mdDialog', 'Containers', 'parentScope'];

  function DestoryDialogController($scope, $location, $mdDialog, Containers, parentScope) {
    $scope.container = parentScope.container;
    $scope.containerShortId = parentScope.containerShortId;

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.params = {
      force: false,
      v: false
    };

    $scope.content = '';

    $scope.ok = function() {
      Containers.delete({
          Id: $scope.containerShortId,
          force: $scope.params.force,
          v: $scope.params.v
        },
        null,
        function() {
          $mdDialog.hide();
          $location.path('/containers');
        },
        function(e) {
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

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.params = {
      t: ''
    };

    $scope.change = function(isRestart) {
      if (isRestart) {
        $scope.preAction = $scope.action;
        $scope.action = 'restart';
      } else {
        $scope.action = $scope.preAction;
      }
    };

    $scope.content = '';

    $scope.ok = function() {
      ContainerActions.update({
          Id: $scope.containerShortId,
          action: $scope.action
        },
        $scope.params,
        function() {
          var running = !$scope.container.State.Running;
          if ($scope.action == 'restart') {
            running = true;
          }
          $mdDialog.hide(running);
        },
        function(e) {
          if (e.status === 304) {
            var running = !$scope.container.State.Running;
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

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.content = '';

    $scope.ok = function() {
      ContainerActions.update({
        Id: $scope.containerShortId,
        action: $scope.action
      }, function(data) {
        var paused = !$scope.container.State.Paused;
        $mdDialog.hide(paused);
      }, function(e) {
        $scope.content = e.data;
      });
    };
  }

  ContainerLogsController.$inject = ['$scope', '$stateParams', 'ContainerActions'];

  function ContainerLogsController($scope, $stateParams, ContainerActions) {
    $scope.containerShortId = $stateParams.Id;
    $scope.queryParams = ContainerActions.logsQueryParams;

    $scope.fetch = function(Id, queryParams) {
      var params = angular.copy(queryParams, {});
      params.Id = Id;
      ContainerActions.logs(params, function(data) {
        $scope.logs = data.text || '';
      });
    };

    $scope.fetch($scope.containerShortId, $scope.queryParams);

    $scope.search = function() {
      $scope.fetch($scope.containerShortId, $scope.queryParams);
    };

    $scope.scrollToEnd = function($ev) {
      var logContent = angular.element($ev.currentTarget).parent().parent()[0];
      if (logContent) {
        logContent.scrollTop = logContent.scrollHeight;
      }
    };
  }

  KillDialogController.$inject = ['$scope', '$mdDialog', 'parentScope', 'ContainerActions'];

  function KillDialogController($scope, $mdDialog, parentScope, ContainerActions) {
    $scope.container = parentScope.container;
    $scope.containerShortId = parentScope.containerShortId;
    $scope.action = 'kill';

    $scope.params = {
      signal: ''
    };

    $scope.content = '';

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.ok = function() {
      ContainerActions.update({
          Id: $scope.containerShortId,
          action: $scope.action
        },
        $scope.params,
        function(data) {
          $mdDialog.hide(false);
        },
        function(e) {
          $scope.content = e.data;
        });
    };
  }

  ContainerTopController.$inject = ['$scope', '$stateParams', 'ContainerActions'];

  function ContainerTopController($scope, $stateParams, ContainerActions) {
    $scope.containerShortId = $stateParams.Id;
    $scope.action = 'top';

    $scope.queryParams = {
      ps_args: ''
    };

    $scope.fetch = function() {
      ContainerActions.get({
          Id: $scope.containerShortId,
          action: $scope.action,
          ps_args: $scope.queryParams.ps_args
        },
        function(data) {
          $scope.Titles = data.Titles;
          $scope.Processes = data.Processes;
        },
        function(data) {}
      );
    };

    $scope.fetch();

    $scope.search = function() {
      $scope.fetch();
    };

  }

})();