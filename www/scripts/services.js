angular.module('app.services',[])
.factory('GuidelinesCache-old', function($cacheFactory){
  return $cacheFactory('GuidelinesCache-old');
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
    all: function(){
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
