(function () {
'use strict';

dockerboardApp.registerModule('sidenav.component');

angular.module('sidenav.component')
  .controller('SidenavCtrl', SidenavController);

SidenavController.$inject = ['$scope', '$location', '$mdSidenav', '$timeout', '$rootScope', 'Menu', 'Hosts', 'iSockPromise'];
function SidenavController($scope, $location, $mdSidenav, $timeout, $rootScope, Menu, Hosts, iSockPromise) {
  $scope.menu = Menu;

  var mainContentArea = document.querySelector('[role="main"]');

  $rootScope.$on('$locationChangeSuccess', openPage);

  $scope.closeMenu = function() {
    $timeout(function() { $mdSidenav('left').close(); });
  };

  $scope.openMenu = function() {
    $timeout(function() { $mdSidenav('left').open(); });
  };

  $scope.host = Hosts.getCurrentHostUrl();

  $rootScope.$on('$hostChangeSuccess', function (e, data) {
    $scope.host = Hosts.getCurrentHostUrl(data);
  });

  $scope.path = function() {
    return $location.path();
  };

  $scope.goHome = function() {
    $scope.menu.selectSection(null);
    $scope.menu.selectPage(null, null);
    $location.path( '/' );
  };

  function openPage() {
    $scope.closeMenu();
    mainContentArea && mainContentArea.focus();
  }

  iSockPromise.then(function(sock) {
    console.dir(sock);
    sock.send("hello");
  });
}
})();
