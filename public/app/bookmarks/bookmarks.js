angular.module('hack.bookmarks', [])

.controller('BookmarksController', function ($scope, $window, Links, Followers, Bookmarks, Auth) {
  $scope.currentBookmarks = Bookmarks.bookmarks;
  $scope.loggedIn = Auth.isAuth();
  $scope.stories = Links.bookmarkStories;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;
  $scope.currentlyFollowing = Followers.following;

  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };
  
  var init = function () {
    Links.getBookmarks();
  };
  init();
});
