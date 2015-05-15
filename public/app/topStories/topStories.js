angular.module('hack.topStories', [])

.controller('TopStoriesController', function ($scope, $window, Links, Followers, Bookmarks, Auth) {
  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;
  $scope.loggedIn = Auth.isAuth();
  $scope.currentlyFollowing = Followers.following;

  $scope.getData = function() {
    Links.getTopStories();
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.isBookmark = function(story) {
    if (Bookmarks.bookmarks.indexOf(story.objectID) === -1) {
      return false;
    } else {
      return true;
    }
  };

  $scope.addBookmark = function(story) {
    Bookmarks.addBookmark(story);
  };

  $scope.removeBookmark = function(story) {
    Bookmarks.removeBookmark(story);
  };

  $scope.getData();
});

