angular.module('hack.tabs', [])

.controller('TabsController', function ($scope, $location, $window, Links, Followers) {
  // If a user refreshes when the location is '/personal',
  // it will stay on '/personal'.
  var hash = $window.location.hash.split('/')[1];
  hash = !hash ? 'all' : hash;
  $scope.currentTab = hash;

  // What is angle? Don't worry. This just makes the
  // refresh button do a cool spin animation. We splurged.
  $scope.angle = 360;

  $scope.changeTab = function(newTab){
    $scope.currentTab = newTab;
    $location.path(newTab);
  };

  $scope.refresh = function(){
    Links.getTopStories();
    Links.getPersonalStories(Followers.following);
    //technically this needs bookmarks and maybe filters here
    $scope.angle += 360;
  };
});
