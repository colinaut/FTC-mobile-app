app

.controller('MasterController', function($scope, $data) {
	$scope.items = $data.items;
})

.controller('DetailController', function($scope, $data) {
	$scope.item = $data.items[$scope.myNavigator.getCurrentPage().options.index];
})

.controller("NewsCtrl", function($http, $scope) {

    $scope.init = function() {

      $http.get("http://ajax.googleapis.com/ajax/services/feed/load", { params: { "v": "1.0", "q": "http://fetus.ucsfmedicalcenter.org/feed/" } })
        .success(function(data) {
                $scope.rssTitle = data.responseData.feed.title;
                $scope.rssUrl = data.responseData.feed.feedUrl;
                $scope.rssSiteUrl = data.responseData.feed.link;
                $scope.entries = data.responseData.feed.entries;
                window.localStorage["entries"] = JSON.stringify(data.responseData.feed.entries);
            })
            .error(function(data) {
                console.log("ERROR: " + data);
                if(window.localStorage["entries"] !== undefined) {
                    $scope.entries = JSON.parse(window.localStorage["entries"]);
                }
            });
    }

})
.controller('VideosCtrl', function($scope, Videogroups) {
  /*$scope.videogroups = Videolist.all(); */


  Videogroups.all().then(function(response){
    $scope.videogroups = response;
  });

})
.controller('VideosDetailCtrl', function($scope, $stateParams, Videogroups) {
  Videogroups.get($stateParams.videogroupsId).then(function(response){
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

.factory('$data',function() {
		var data = {};

		data.items = [
			{
				title: 'Item Title',
				label: '4 h',
				desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
			},
			{
				title: 'Another Item Title',
				label: '6 h',
				desc: 'Ut enim ad minim veniam.'
			},
			{
				title: 'Yet Another Item Title',
				label: '1 day ago',
				desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
			},
			{
				title: 'And One More Item Title',
				label: '3 days ago',
				desc: 'Minim veniam aute irure dolor in eiusmod tempor incididunt ut labore et dolore eu fugiat nulla pariatur.'
			}
		];

		return data;
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
	        for (var i = 0; i < response.length; i++) {
	         if (response[i].id === parseInt(videogroupsId)) {
	           return response[i];
	         }
	       }
	      });
	      return null;
	    }
	  };



	});
