angular.module('hack.topStories', [])

.controller('TopStoriesController', function ($scope, $window, Links, Followers, Bookmarks) {
  angular.extend($scope, Links);
  $scope.bookmarked = false;
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
    $scope.bookmarked = true;
    Bookmarks.addBookmark(story);
  };

  $scope.removeBookmark = function(story) {
    $scope.bookmarked = false;
  };

  $scope.getData();
});

