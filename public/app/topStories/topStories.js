angular.module('hack.topStories', [])

.controller('TopStoriesController', function ($scope, $window, Links, Followers, Bookmarks, Auth) {
  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;
  $scope.loggedIn = Auth.isAuth();
  $scope.currentlyFollowing = Followers.following;
  $scope.currentBookmarks = Bookmarks.bookmarks;

  $scope.getData = function() {
    Links.getTopStories();
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.isBookmark = function(story) {
    console.log('isBookmark was called');
    var link = {
      url: story.url,
      title: story.title,
      author: story.author,
      created_at: story.created_at,
      objectID: story.objectID
    };
    console.log($scope.currentBookmarks);
    if (!$scope.currentBookmarks || $scope.currentBookmarks.indexOf(link) === -1) {
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

