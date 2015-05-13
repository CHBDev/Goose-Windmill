angular.module('hack.topStories', [])

.controller('TopStoriesController', function ($scope, $window, Links, Followers, Bookmarks) {
  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;

  $scope.currentlyFollowing = Followers.following;

  $scope.getData = function() {
    Links.getTopStories();
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.addBookmark = function(story) {
    console.log(story);
    Bookmarks.addBookmark(story);
  };

  $scope.getData();
});

