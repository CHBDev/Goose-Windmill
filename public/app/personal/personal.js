angular.module('hack.personal', [])

.controller('PersonalController', function ($scope, $window, Links, Followers, Auth, Bookmarks) {
  $scope.stories = Links.personalStories;
  $scope.users = Followers.following;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;
  $scope.loggedIn = Auth.isAuth();

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

  var init = function(){
    fetchUsers();
  };
  
  var fetchUsers = function(){
    Links.getPersonalStories($scope.users);
  };
  
  init();
});

