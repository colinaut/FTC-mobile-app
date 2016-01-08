
var app = angular.module('myApp', ['onsen', 'ui.router', 'angular-cache', 'ngSanitize']);

app
.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])
.filter('externalizeLinks' [function () {
    return function() {
      return ;
    }
}])
.directive('updatelinks', function($timeout) {
    return {
        link: function(scope, element) {
            $timeout(function() {
                element.find('a[href^="https://www.youtube.com"]').remove();
                element.find('a').on("click", function(e){
                  //console.log(angular.element(this).attr("target"));
                  window.open(angular.element(this).attr("href"), '_blank');
                  e.preventDefault();
                });
            });
        }
    };
})
.filter('convertLinks', function () {
    return function(input) {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      var content = input.replace(exp,'<a ng-click="alertLink(\'$1\')">$1</a>');

      return content;
    };
  })
.config(function($stateProvider, $urlRouterProvider) {

	// By default show Tab 1 - Navigator MasterDetail example
	$urlRouterProvider.otherwise('/news');

	$stateProvider

		// Tab 1 - MasterDetail example - Navigator init
		.state('navigator', {
			abstract: true,
			// url: '/navigator', // Optional url prefix
			resolve: {
				loaded: function($rootScope) {
					$rootScope.myTabbar.setActiveTab(0);
					return $rootScope.myTabbar.loadPage('html/tab1.html');
				}
			}
		})

		// News RSS feed
		.state('navigator.news', {
			parent: 'navigator',
			url: '/news',
			onEnter: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.resetToPage('html/news.html');
			}]
		})

		// Tab 1 - MasterDetail example - List of items
		.state('navigator.master', {
			parent: 'navigator',
			url: '/master',
			onEnter: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.resetToPage('html/master.html');
			}]
		})

		// Tab 1 - MasterDetail example - Item details
		.state('navigator.master.detail', {
			parent: 'navigator.master',
			url: '/detail/:index',
			onEnter: ['$rootScope','$stateParams', function($rootScope,$stateParams) {
				$rootScope.myNavigator.pushPage('html/detail.html', {'index': $stateParams.index});
			}],
			onExit: function($rootScope) {
				$rootScope.myNavigator.popPage();
			}
		})
    // Guidelines
		.state('navigator.guidelines', {
			parent: 'navigator',
			url: '/guidelines',
			onEnter: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.resetToPage('html/guidelines.html');
			}]
		})

		// Guidelines Detail
		.state('navigator.guidelines.detail', {
			parent: 'navigator.guidelines',
			url: '/guidelines/:index',
			onEnter: ['$rootScope','$stateParams', function($rootScope,$stateParams) {
				$rootScope.myNavigator.pushPage('html/guideline-detail.html', {'index': $stateParams.index});
			}],
			onExit: function($rootScope) {
				$rootScope.myNavigator.popPage();
			}
		})
    // List of Video Groups
    .state('navigator.videos', {
      parent: 'navigator',
      url: '/videos',
      onEnter: ['$rootScope', function($rootScope) {
        $rootScope.myNavigator.resetToPage('html/videos.html');
      }]
    })
    // Detail of Video Group
    .state('navigator.videos.group', {
      parent: 'navigator.videos',
      url: '/videogroup/:index',
      onEnter: ['$rootScope','$stateParams', function($rootScope, $stateParams) {
        $rootScope.myNavigator.pushPage('html/videogroup.html', {'index': $stateParams.index});
      }],
      onExit: function($rootScope) {
				$rootScope.myNavigator.popPage();
			}
    })
    .state('navigator.contact', {
			parent: 'navigator',
			url: '/contact',
			onEnter: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.resetToPage('html/contact.html');
			}]
		})


	;

});
