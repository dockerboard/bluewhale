(function () {
'use strict';

dockerboardApp.registerModule('hosts.ctrl');

angular.module('hosts.ctrl')
  .controller('HostsCtrl', HostsController)
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.
        state('hosts', {
          url: '/hosts',
          templateUrl: '/js/modules/hosts/views/hosts.tpl.html'
        });
    }
  ]);


HostsController.$inject = ['$scope', '$rootScope', '$mdDialog', 'Hosts'];
function HostsController($scope, $rootScope, $mdDialog, Hosts) {
  Hosts.query(function (data) {
    $scope.hosts = data;
  });

  $scope.selectedIndex = 0;

  $scope.select = function (index) {
    $scope.selectedIndex = index;
    Hosts.CurrentHost = $scope.hosts[index];
    $rootScope.$emit('$hostChangeSuccess', Hosts.CurrentHost);
  };

  $scope.create = function (ev) {
    $mdDialog.show({
      controller: CreateDialogController,
      templateUrl: '/js/modules/hosts/views/hosts.create.dialog.tpl.html',
      targetEvent: ev,
    })
      .then(function (host) {
        updateHost(host);
      });
  };

  $scope.destroy = function (index) {
    Hosts.delete({
      Id: encodeURIComponent(Hosts.getCurrentHostUrl($scope.hosts[index]))
    }, function (data) {
      $scope.hosts.splice(index, 1);
    });
  };

  function updateHost(host) {
    var exists = false;
    for (var i = 0, l = $scope.hosts.length; i < l; i++) {
      var h = $scope.hosts[i];
      if (h.URL.Scheme === host.URL.Scheme && h.URL.Host === host.URL.Host) {
        $scope.hosts[i] = host;
        exists = true;
        break;
      }
    }
    if (!exists) {
      $scope.hosts.push(host);
    }
  }
}

CreateDialogController.$inject = ['$scope', '$mdDialog', 'Hosts'];
function CreateDialogController($scope, $mdDialog, Hosts) {
  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.name= '';
  $scope.host = '';

  $scope.content = '';

  $scope.ok = function () {
    if (!$scope.host) $scope.cancel();
    Hosts.save({
      name: $scope.name,
      host: $scope.host
    }, function (data) {
      $mdDialog.hide(data);
    }, function (data) {
      $scope.content = data;
    });
  };
}

})();
