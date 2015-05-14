// HOW OUR FOLLOWING SYSTEM WORKS:
// We want users to be able to follow people before they even
// log in, because who actually has time to decide on a story/password?

// So, we do this by saving the users that they follow into localStorage.
// On signup, we'll send the users string in localStorage to our server
// which wil save them to a database.

angular.module('hack.bookmarkService', [])

.factory('Bookmarks',  function($http, $window) {
  var bookmarks = [];

  var updateBookmarks = function(){
   var user = $window.localStorage.getItem('com.hack');
   var temp = localStorageBookmarks();
  
    if(!!user){
      var data = {
        username: user,
        bookmarks: '['+temp.slice("undefined,".length)+']'
      };

      $http({
        method: 'POST',
        //TODO: create server route for bookmarks
        url: '/api/bookmarks/updateBookmarks',
        data: data
      });
    }
  };

  //to add bookmark:
  //add storyID to array on User object
  //check bookmark database and upsert object into bookmark database

  var localStorageBookmarks = function(){
    return $window.localStorage.getItem('hfBookmarks');
  };

  var localToArr = function(){
    if(!localStorageBookmarks()){
      // If the person is a new visitor, set pg and sama as the default
      // people to follow. Kinda like Tom on MySpace. Except less creepy.
      $window.localStorage.setItem('hfBookmarks', '');
    }
    var bms = localStorageBookmarks().split(',');

    bookmarks.splice(0, bookmarks.length);
    bookmarks.push.apply(bookmarks, bms);
  };

  var addBookmark = function(story){
    var story = {
      url: story.url,
      title: story.title,
      author: story.author,
      created_at: story.created_at,
      objectID: story.objectID
    };
    story = JSON.stringify(story);
    var localBookmarks = localStorageBookmarks();

    if (!localBookmarks.includes(story) && bookmarks.indexOf(story) === -1) {
      localBookmarks += ',' + story
      $window.localStorage.setItem('hfBookmarks', localBookmarks);
      bookmarks.push(story);
    }

    // makes call to database to mirror our changes
     updateBookmarks();
  };

  var removeBookmark = function(story){
    var localBookmarks = localStorageBookmarks();

    if (localBookmarks.includes(story) && bookmarks.indexOf(story) > -1) {
      following.splice(bookmarks.indexOf(story), 1);

      localBookmarks = localBookmarks.split(',');
      localBookmarks.splice(localBookmarks.indexOf(story), 1).join(',');
      $window.localStorage.setItem('hfBookmarks', localBookmarks);
    }

    // makes call to database to mirror our changes
    updateBookmarks();
  };

  var init = function(){
    localToArr();
  };

  init();

  return {
    addBookmark: addBookmark,
    removeBookmark: removeBookmark,
    updateBookmarks: updateBookmarks
  }
});
