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
	    return $http.get('data/guidelines.json', { cache: guidelinesCache }).then(function(response){
	      return response.data.guidelines;
	    });
	  }

	  return {
	    all: function() {
	      return guidelinesData();
	    },

	    get: function(guidelinesId) {
	      var guidelines

	      return guidelinesData().then(function(response){
	        for (var i = 0; i < response.length; i++) {
	         if (response[i].id === parseInt(guidelinesId)) {
	           return response[i];
	         }
	       }
	      });

	      return null;

	    }

	  }

	})
	.controller('BlogCtrl', function ($scope, BlogList) {
	        $scope.feeds = BlogList.get();
	    })
	.factory('FeedLoader', function ($resource) {
	    console.log("Creating FeedLoader...");
	    return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
	        fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
	    });
	})
	.service('BlogList', function ($rootScope, FeedLoader) {
	    var feeds = [];
	    console.log("loading feeds...");
	    this.get = function() {
	        var feedSources = [
	            {title: 'Mashable', url: 'http://feeds.mashable.com/Mashable'},
	            {title: 'TechCrunch', url: 'http://feeds.feedburner.com/TechCrunch/'}
	        ];
	        if (feeds.length === 0) {
	            for (var i=0; i<feedSources.length; i++) {
	                FeedLoader.fetch({q: feedSources[i].url, num: 10}, {}, function (data) {
	                    var feed = data.responseData.feed;
	                    console.log("DATA FROM FEEDS: ", data)
	                    feeds.push(feed);
	                });
	            }
	        }
	        return feeds;
	    };
	})
	;
