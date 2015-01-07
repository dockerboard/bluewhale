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


HostsController.$inject = ['$scope', '$rootScope', '$mdDialog', '$mdToast', 'Hosts', 'HostActions'];
function HostsController($scope, $rootScope, $mdDialog, $mdToast, Hosts, HostActions) {
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

  $scope.ping = function (index) {
    HostActions.ping({
      Id: encodeURIComponent(Hosts.getCurrentHostUrl($scope.hosts[index]))
    },
    function (data) {
      if (data.text === 'OK') {
        $mdToast.show(
          $mdToast.simple()
            .content('Ping OK!')
            .position('top right')
            .action('Close')
            .hideDelay(1500)
        );
      }
    },
    function () {
      $mdToast.show(
        $mdToast.simple()
          .content('Ping Faild!')
          .position('top right')
          .action('Close')
          .hideDelay(1500)
      );
    })
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

  $scope.version = function (ev, index) {
    HostActions.get({
      Id: encodeURIComponent(Hosts.getCurrentHostUrl($scope.hosts[index])),
      action: 'version'
    },
    function (data) {
      $mdDialog.show({
        controller: VersionDialogController,
        templateUrl: '/js/modules/hosts/views/host.version.dialog.tpl.html',
        locals: { docker: data },
        targetEvent: ev
      });
    },
    function () {
      $mdToast.show(
        $mdToast.simple()
          .content('Get Docker Version Faild!')
          .position('top right')
          .action('Close')
          .hideDelay(1500)
      );
    })
  };
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

VersionDialogController.$inject = ['$scope', '$mdDialog', 'docker'];
function VersionDialogController($scope, $mdDialog, docker) {
  $scope.docker = docker;
  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.ok = function () {
    $mdDialog.hide();
  };
}

})();
