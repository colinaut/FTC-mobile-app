app

.controller('MasterController', function($scope, $data) {
	$scope.items = $data.items;
})

.controller('DetailController', function($scope, $data) {
	$scope.item = $data.items[$scope.myNavigator.getCurrentPage().options.index];
})

.controller('GuidelinesCtrl', function($scope, Guidelines, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  Guidelines.all().then(function(response){
    $scope.guidelines = response;
  });

})

.controller('GuidelineDetailCtrl', function($scope, $stateParams, Guidelines) {
  Guidelines.get($stateParams.index).then(function(response){
    $scope.guideline = response;
  });
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
})

.controller("NewsCtrl", function($http, $scope) {

    $scope.init = function() {

      $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Ffetus.ucsfmedicalcenter.org%2Ffeed'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
      .success(function(data) {
				$scope.rssTitle = data.query.results.rss.channel.title;
				$scope.rssUrl = "http://fetus.ucsfmedicalcenter.org/feed";
				$scope.rssSiteUrl = data.query.results.rss.channel.link;
				$scope.entries = data.query.results.rss.channel.item;
          window.localStorage["entries"] = JSON.stringify(data.query.results.rss.channel.item);
      })
      .error(function(data) {
          console.log("ERROR: " + data);
          if(window.localStorage["entries"] !== undefined) {
              $scope.entries = JSON.parse(window.localStorage["entries"]);
          }
      });
    }
		$scope.readmore = function(entry,event) {
			window.open(entry.link, '_blank');
		}

})

.controller('VideosCtrl', function($scope, Videogroups) {
  /*$scope.videogroups = Videolist.all(); */


  Videogroups.all().then(function(response){
    $scope.videogroups = response;
  });

})
.controller('VideosDetailCtrl', function($scope, $stateParams, Videogroups) {
  Videogroups.get($stateParams.index).then(function(response){
    $scope.videogroup = response;
  });

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

})

	.factory('Videogroups', function($http, CacheFactory) {

	  // Set up cache is there isn't one.
	  if (!CacheFactory.get('videosCache')) {
	    CacheFactory.createCache('videosCache', {});
	  }

	  // Load cache
	  var videosCache = CacheFactory.get('videosCache');

	  // Get data from JSON using cache if present
	  var videosData = function() {
	    return $http.get('data/videos.json', { cache: videosCache }).then(function(response){
	      return response.data.videos;
	    });
	  }

	  return {
	    all: function() {
	      return videosData();
	    },
	    get: function(videogroupsId) {
	      return videosData().then(function(response){
	        return response[parseInt(videogroupsId)];
	      });
	      return null;
	    }
	  };

	})
	.factory('Guidelines-', function($http, CacheFactory) {

	  // Create cache if there isn't one.
	  if (!CacheFactory.get('guidelinesCache')) {
	    // or CacheFactory('bookCache', { ... });
	    CacheFactory.createCache('guidelinesCache', {});
	  }
	  // Get cache
	  var guidelinesCache = CacheFactory.get('guidelinesCache');

	  // Get data from JSON using cache if present
	  var guidelinesData = function() {
	    return $http.get('data/guidelines.json', { cache: guidelinesCache }).then(function(response){
	      return response.data.guidelines;
	    });
	  }

		var guidelinesSiteData = function() {
			return $http.get('http://colinaut.com/test/guidelines.json').then(function(response){
	      console.log("sitedata: " + response.data.version);
				return response.data.guidelines;

	    });
		}

	  return {
	    all: function() {
	      return guidelinesSiteData();
	    },

	    get: function(guidelinesId) {
	      var guidelines

	      return guidelinesSiteData().then(function(response){
					return response[parseInt(guidelinesId)];
	      });

	      return null;

	    }

	  }

	})

	.factory('Guidelines', function($http, CacheFactory) {

		// Create cache if there isn't one.
		if (!CacheFactory.get('guidelinesCache')) {
			// or CacheFactory('bookCache', { ... });
			CacheFactory.createCache('guidelinesCache', {});
		}
		// Get cache
		var guidelinesCache = CacheFactory.get('guidelinesCache');

		// Get data from JSON using cache if present
		var guidelinesData = function() {
			var datatemp;
			return $http.get('http://colinaut.com/test/guidelines.json').then(function(response){
				datatemp = response.data.guidelines;
				return datatemp;
			}, function(response) {
				return $http.get('data/guidelines.json').then(function(response){
					datatemp = response.data.guidelines;
					return datatemp;
				});
			});

		}

		return {
	    all: function() {
				return guidelinesData();
	    },

	    get: function(guidelinesId) {
	      var guidelines

	      return guidelinesData().then(function(response){
					return response[parseInt(guidelinesId)];
	      });

	      return null;

	    }

	  }

	})
	;
