// HOW OUR FOLLOWING SYSTEM WORKS:
// We want users to be able to follow people before they even
// log in, because who actually has time to decide on a story/password?

// So, we do this by saving the users that they follow into localStorage.
// On signup, we'll send the users string in localStorage to our server
// which wil save them to a database.

angular.module('hack.bookmarkService', [])

.factory('Bookmarks',  function($http, $window) {
  var bookmarks = [];
  var user = $window.localStorage.getItem('com.hack');

  var addBookmark = function(story){

    var article = {
      points: story.points,
      url: story.url,
      title: story.title,
      author: story.author,
      created_at: story.created_at,
      objectID: story.objectID,
      num_comments: story.num_comments
    };
    var data = {
      username: user,
      bookmark: article
    };

   $http({
      method: 'POST',
      url: '/api/bookmarks/addBookmark',
      data: data
    });

    if (bookmarks.indexOf(article.objectID) === -1) {
      bookmarks.push(article.objectID);
    }
  };

  var removeBookmark = function(story){
    var article = {
      objectID: story.objectID
    };

    var data = {
      username: user,
      bookmark: article
    };

   $http({
      method: 'POST',
      url: '/api/bookmarks/removeBookmark',
      data: data
    });

    var splicePoint = bookmarks.indexOf(article.objectID);
    bookmarks.splice(splicePoint, 1);
  };

  return {
    bookmarks: bookmarks,
    addBookmark: addBookmark,
    removeBookmark: removeBookmark
  }
});
