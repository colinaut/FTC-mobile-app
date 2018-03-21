app

.controller('GuidelinesCtrl', function($scope, Data) {
  Data.all("guidelines").then(function(response){
    $scope.guidelines = response.list;
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
    $scope.videogroups = response.list;
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
    $scope.team = response.list;
		$scope.intro = response.intro;
  });

})

.controller('TeamDetailCtrl', function($scope, $stateParams, Data) {
  Data.get("team",$stateParams.index).then(function(response){
    $scope.specialty = response;
  });

	//$scope.hidden = true;
})

.factory('Data', function($http, Cacher) {

  var gist = 'https://gist.githubusercontent.com/colinaut/c2c2f95d259158edd6b261d68c69e427/raw/data2.json';
  var backup = 'data/data.json';

	var jsonData = function() {
		return Cacher.getData(gist,backup).then(
			function(response){
				return response.data;
			}
    );
	}

	return {
		all: function(section) {
			return jsonData().then(function(response){
				return response[section];
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

.factory('News', function($http, Cacher) {

	var newsData = function() {
	  var rssJSON = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Ffetus.ucsfmedicalcenter.org%2Ffeed'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    return Cacher.getData(rssJSON).then(
	    function(response){
  			return response.data.query.results.rss.channel;
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
