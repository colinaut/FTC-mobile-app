
var app = angular.module('myApp', ['onsen', 'ui.router', 'angular-cache', 'ngSanitize']);

app
.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

.filter('nl2p', function () {
    return function(text){
        text = String(text).trim();
        return (text.length > 0 ? '<p>' + text.replace(/[\r\n]+/g, '</p><p>') + '</p>' : null);
    }
})

.directive('updatelinks', function($timeout) {
    return {
        link: function(scope, element) {
            $timeout(function() {
                element.find('a[href^="https://www.youtube.com"]').remove();
                element.find('a').on("click", function(e){
                  window.open(angular.element(this).attr("href"), '_blank');
                  e.preventDefault();
                });
            });
        }
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

    // List of Team
    .state('navigator.team', {
      parent: 'navigator',
      url: '/team',
      onEnter: ['$rootScope', function($rootScope) {
        $rootScope.myNavigator.resetToPage('html/team.html');
      }]
    })

    // List of Team members in specialty
		.state('navigator.team.specialty', {
			parent: 'navigator.team',
			url: '/team/:index',
			onEnter: ['$rootScope','$stateParams', function($rootScope,$stateParams) {
				$rootScope.myNavigator.pushPage("html/team-specialty.html", {'index': $stateParams.index});
			}],
			onExit: function($rootScope) {
				$rootScope.myNavigator.popPage();
			}
		})

    // Contact page
    .state('navigator.contact', {
			parent: 'navigator',
			url: '/contact',
			onEnter: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.resetToPage('html/contact.html');
			}]
		})


	;

})

.config(function (CacheFactoryProvider) {
  angular.extend(CacheFactoryProvider.defaults, {
    //maxAge: 3600000,
    maxAge: 36000000,
    deleteOnExpire: 'aggressive',
    onExpire: function (key, value) {
      var _this = this; // "this" is the cache in which the item expired
      angular.injector(['ng']).get('$http').get(key).success(function (data) {
        _this.put(key, data);
      });
    }
  });
})

.service('Cacher', function ($q, $http, CacheFactory) {

  CacheFactory('shallowCache', {
    maxAge: 60 * 60 * 1000, // Items added to this cache expire after an hour
    deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
  });

  CacheFactory('deepCache', {
    storageMode: 'localStorage' // This cache will use `localStorage`
  });

  return {
    getData: function (url, backup) {
      var deferred = $q.defer();
      var start = new Date().getTime();
      var shallowCache = CacheFactory.get('shallowCache');
      var deepCache = CacheFactory.get('deepCache');

      if (shallowCache.get(url)) { //check first for local session cache
        deferred.resolve(shallowCache.get(url));

      } else if (deepCache.get(url)) { //if can't find session cache then search for the localStorage cache
        deferred.resolve(deepCache.get(url));

        $http.get(url).then(function (data) { //check for new version on the server
          console.log('DEEP Found, get new time taken for request: ' + (new Date().getTime() - start) + 'ms');
          shallowCache.put(url, data); //put in session storage
          deepCache.put(url, data); //put in localStorage
        });

      } else if (backup) { // if neither session or local exist then use permenant backup

        $http.get(backup).then(function (data) {
          console.log('BACKUP: time taken for request: ' + (new Date().getTime() - start) + 'ms');
          deferred.resolve(data); //use this for now

          $http.get(url).then(function (data) { //try to grab new version and put in cache
            console.log('Try for new after backup: time taken for request: ' + (new Date().getTime() - start) + 'ms');
            shallowCache.put(url, data);
            deepCache.put(url, data);
          });
        });
      } else { //if all else fails try to grab online version

        $http.get(url).then(function (data) { //success
          console.log('None found: time taken for request: ' + (new Date().getTime() - start) + 'ms');
          shallowCache.put(url, data);
          deepCache.put(url, data);
          deferred.resolve(data);
        }, function () { //if there is no cache and you can't get the online JSON

        });
      }

      return deferred.promise;

    }
  };
})
;
