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

.controller("NewsCtrl", function($http, News, $scope) {
	News.all().then(function(response){
		$scope.rssTitle = response.title;
		$scope.rssUrl = "http://fetus.ucsfmedicalcenter.org/feed";
		$scope.rssSiteUrl = response.link;
		$scope.entries = response.item;
  });




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
		$scope.playVideo = function(vidid) {
			//alert("hi: " + vidid);
			YoutubeVideoPlayer.openVideo(vidid);
		}
  });
})

.factory('Videogroups', function($http, CacheFactory) {

	var videoCache;

  // Check to make sure the cache doesn't already exist
  if (!CacheFactory.get('videoCache')) {
    videoCache = CacheFactory('videoCache');
  }

  // Get data from JSON using cache if present
  var videosData = function() {
		return $http.get('data/data.json').then(function(response){
      return response.data.videos.list;
    });
  }
	var videosData = function() {
		var datatemp;
		return $http.get('https://jsonblob.com/api/jsonBlob/aa9b57f0-dde7-11e6-90ab-eded01532e70', {cache:false}).then(
			function(response){
				datatemp = response.data.videos.list;
				return datatemp;
			},
			function(response) {
				return $http.get('data/data.json', {cache:false}).then(function(response){
					datatemp = response.data.videos.list;
					return datatemp;
				}
			);
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
		return $http.get('http://jsonblob.com/api/jsonBlob/aa9b57f0-dde7-11e6-90ab-eded01532e70').then(
			function(response){
				datatemp = response.data.guidelines.list;
				return datatemp;
			},
			function(response) {
				return $http.get('data/data.json').then(function(response){
					datatemp = response.data.guidelines.list;
					return datatemp;
				}
			);
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

.factory('News', function($http, CacheFactory) {

	// Create cache if there isn't one.
	if (!CacheFactory.get('newsCache')) {
		// or CacheFactory('bookCache', { ... });
		CacheFactory.createCache('newsCache', {});
	}
	// Get cache
	var newsCache = CacheFactory.get('newsCache');

	// Get data from JSON using cache if present
	var newsData = function() {
		var datatemp;
		return $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Ffetus.ucsfmedicalcenter.org%2Ffeed'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys").then(
			function(response){
				datatemp = response.data.query.results.rss.channel;
				return datatemp;

			}
			)
		};


	return {
    all: function() {
			return newsData();
    }
  }
})
;
