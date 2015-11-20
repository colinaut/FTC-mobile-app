// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var myApp = angular.module('app', ['onsen','app.services', 'angular-cache', 'ui.router']);

myApp.controller('AppController', function ($scope) {

})
.controller('Home', function ($scope) {
  console.log("hi");
  $scope.List = {
    configureItemScope: function(index, itemScope) {
      console.log("Created item #" + index);
      itemScope.item = {
        name: 'Item #' + (index + 1)
      };
    },
    calculateItemHeight: function(index) {
      return 40;
    },
    countItems: function() {
      return 10;
    },
    destroyItemContent: function(index, element) {
      console.log("Destroyed item " + index);
    }
  }

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

.controller('MyCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {

  $scope.MyDelegate = {
    configureItemScope: function(index, itemScope) {
      if (!itemScope.item) {
        console.log("Created item #" + index);
        itemScope.canceler = $q.defer();

        itemScope.item = {
          title: 'Item #' + (index + 1),
          label: '',
          desc: '',
          rand: Math.random()
        };
        $http.get('https://baconipsum.com/api/?type=meat-and-filler&sentences=1', {
          timeout: itemScope.canceler.promise
        }).success(function(data) {
          itemScope.item.desc = data[0];
          itemScope.item.label = itemScope.item.desc.substr(0, itemScope.item.desc.indexOf(" ")) + 'bacon'
        }).error(function() {
          itemScope.item.desc = 'No bacon lorem ipsum';
          itemScope.item.label = 'No bacon'
        });
      }
    },
    calculateItemHeight: function(index) {
      return 91;
    },
    countItems: function() {
      return 10000000;
    },
    destroyItemScope: function(index, itemScope) {
      itemScope.canceler.resolve();
      console.log("Destroyed item #" + index);
    }
  };
}])

.controller('MyCtrl2', ['$scope', '$http', '$q', function($scope, $http, $q) {

  $scope.MyDelegate = {
    configureItemScope: function(index, itemScope) {
      if (!itemScope.item) {
        console.log("Created item #" + index);
        itemScope.canceler = $q.defer();

        itemScope.item = {
          title: 'Item #' + (index + 1),
          rssTitle: 'test',
          label: '',
          desc: '',
          rand: Math.random()
        };
        $http.get("http://ajax.googleapis.com/ajax/services/feed/load", { params: { "v": "1.0", "q": "http://fetus.ucsfmedicalcenter.org/feed/" }, timeout: itemScope.canceler.promise })
        .success(function(data) {

          itemScope.item.rssUrl = data.responseData.feed.feedUrl;
          itemScope.item.rssSiteUrl = data.responseData.feed.link;
          itemScope.item.title = data.responseData.feed.entries[index].title;
          itemScope.item.desc = data.responseData.feed.entries[index].content;
          //window.localStorage["entries"] = JSON.stringify(data.responseData.feed.entries);
        }).error(function() {
          itemScope.item.rssTitle = 'no title';
          itemScope.item.label = 'No bacon'
        });
      }
    },
    calculateItemHeight: function(index) {
      return 91;
    },
    countItems: function() {
      return 10000000;
    },
    destroyItemScope: function(index, itemScope) {
      itemScope.canceler.resolve();
      console.log("Destroyed item #" + index);
    }
  };
}])
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
.controller('NewsCtrl2', function($scope) {
    $scope.entries = [
      {
        title: 'Item 1',
        content: 'Item 1 Description'
      },
      {
        title: 'Item 2',
        dcontent: 'Item 2 Description'
      },
      {
        title: 'Item 3',
        content: 'Item 3 Description'
      }
    ];
 })
 .controller('VideosCtrl', function($scope, Videogroups) {
   /*$scope.videogroups = Videolist.all(); */

   Videogroups.all().then(function(response){
     $scope.videogroups = response;
   });
   $scope.showDetail = function(index){
        var selectedItem = Videogroups.videogroups[index];
        Data.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('page2.html', selectedItem.title);
    }
 })
 .controller('VideosDetailCtrl', function($scope, $stateParams, Videogroups) {
   Videogroups.get($stateParams.videogroupsId).then(function(response){
     $scope.videogroup = response;
   });

 })
.filter('unsafe', function($sce) {
    return function(val) {
    return $sce.trustAsHtml(val);
    };
})
.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
