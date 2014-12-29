(function () {
'use strict';

angular.module('dockerboard.services')
  .factory('Menu', ['$rootScope', '$location', function ($rootScope, $location) {
    var sections = [
      /*
      {
        name: 'Apps',
        url: '/apps'
      },
     */
      {
        name: 'Dashboard',
        url: '/dashboard'
      },
      {
        name: 'Containers',
        url: '/containers'
      },
      {
        name: 'Images',
        url: '/images'
      },
      {
        name: 'Hosts',
        url: '/hosts',
        tooltip: 'Docker Hosts'
      },
      {
        name: 'System',
        url: '/system',
        tooltip: 'System Info'
      },
      {
        name: 'Canvas',
        url: '/canvas'
      }
    ];

    var self;

    $rootScope.$on('$locationChangeSuccess', onLocationChange);

    return self = {
      sections: sections,

      breadcrumbs: [],

      selectSection: function(section) {
        self.currentSection = section;
        if (section) {
          self.breadcrumbs[0] = section;
        } else {
          self.breadcrumbs.length = 0;
        }
      },
      toggleSelectSection: function(section) {
        if (self.isSectionSelected(section)) return;
        self.selectSection(section);
      },
      isSectionSelected: function(section) {
        return self.currentSection === section;
      },
      selectPage: function(page, subSection) {
        self.currentPage = page;
        self.currentPageSubSection = subSection;
        if (subSection) {
          self.breadcrumbs[2] = subSection;
        } else {
          self.breadcrumbs.length = 2;
        }
        if (page) {
          self.breadcrumbs[1] = page;
        } else {
          self.breadcrumbs.length = 1;
        }
      },
      isPageSelected: function(page) {
        return self.currentPage === page;
      },
      breadcrumbUrl: function (index) {
        var segments = self.breadcrumbs.slice(0, index + 1);
        segments.forEach(function (v, i) {
          segments[i] = v.url || v;
        });
        return segments.join('/');
      }
    };

    function onLocationChange() {
      var activated = false;
      var path = $location.$$path;
      sections.forEach(function(section) {
        if (section && section.url) {
          var segments = path.split('/');
          var currSection = segments.slice(0, 2).join('/');
          if (currSection === section.url) {
            self.selectPage(segments[2], segments[3]);
            self.selectSection(section);
            activated = true;
          }
        }
      });
      if (!activated) {
        self.selectPage(null, null);
        self.selectSection(null);
        self.breadcrumbs.length = 0;
      }
    }
  }]);

})();
