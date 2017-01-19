app

.controller('GuidelinesCtrl', function($scope, Data) {
  Data.all("guidelines").then(function(response){
    $scope.guidelines = response;
  });
})

.controller('GuidelineDetailCtrl', function($scope, $stateParams, Data) {
  Data.get("guidelines",$stateParams.index).then(function(response){
    $scope.guideline = response;
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

.controller('VideosCtrl', function($scope, Data) {
  Data.all("videos").then(function(response){
    $scope.videogroups = response;
  });
})

.controller('VideosDetailCtrl', function($scope, $stateParams, Data) {
  Data.get("videos", $stateParams.index).then(function(response){
    $scope.videogroup = response;
		$scope.playVideo = function(vidid) {
			YoutubeVideoPlayer.openVideo(vidid);
		}
  });
})

.controller('TeamCtrl', function($scope, Data) {
  Data.all("team").then(function(response){
    $scope.team = response;
  });

})

.controller('TeamDetailCtrl', function($scope, $stateParams, Data) {
  Data.get("team",$stateParams.index).then(function(response){
    $scope.specialty = response;
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

.factory('Data', function($http, CacheFactory) {

	// Create cache if there isn't one.
	if (!CacheFactory.get('dataCache')) {
		// or CacheFactory('bookCache', { ... });
		CacheFactory.createCache('dataCache', {});
	}
	// Get cache
	var dataCache = CacheFactory.get('dataCache');

	// Get data from JSON using cache if present
	var jsonData = function() {
		var datatemp;
		return $http.get('http://jsonblob.com/api/jsonBlob/aa9b57f0-dde7-11e6-90ab-eded01532e70').then(
			function(response){
				datatemp = response.data;
				return datatemp;
			},
			function(response) {
				return $http.get('data/data.json').then(function(response){
					datatemp = response.data;
					return datatemp;
				}
			);
		});
	}

	return {
		all: function(section) {
			return jsonData().then(function(response){
				return response[section].list;
			});
		},
		get: function(section,id) {
			return jsonData().then(function(response){
				return response[section].list[parseInt(id)];
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
