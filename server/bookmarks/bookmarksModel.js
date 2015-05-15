var mongoose = require('mongoose');
var Promise = require('bluebird');

var BookmarksSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  created_at: {
    type: String,
    required: true
  },
  objectID: {
    type: String,
    required: true
  },
  usernames: {
    type: [String],
    required: true
  }
});

var Bookmark = mongoose.model('bookmarks', BookmarksSchema);

//Update & Add Bookmarks incomplete
Bookmark.prototype.addBookmark = function (bookmark, username, callback){
  //try to find the most recently clicked article in db by its ID
  Bookmark.findOne({objectID: bookmark.objectID}, 'usernames', function (err, result) {
    var allUsernames;
    if (err) console.log(err);
    //if article is not in db 
    if (!result) {
      allUsernames = [];
    } else {
    //if article in db, then allUsernames is the result.usernames array
      //console.log('THIS IS THE RESULT OF FINDONE', result.usernames);
      allUsernames = result.usernames;
    }
    //regardless, add username to array, and upsert the article
    allUsernames.push(username);
    console.log(allUsernames);
    Bookmark.update({objectID: bookmark.objectID}, 
      {title: bookmark.title, 
      url: bookmark.url, 
      author: bookmark.author, 
      created_at: bookmark.created_at,
      objectID: bookmark.objectID, 
      usernames: allUsernames}, {upsert: true}, function(err, result) {
        if (err) console.log(err);
    });
  })
};

Bookmark.prototype.removeBookmark = function (bookmark, username, callback) {
  Bookmark.findOne({objectID: bookmark.objectID}, 'usernames', function (err, result) {
    if (err) console.log(err);
    var allUsernames = result.usernames;
    var splicePoint = allUsernames.indexOf(username);
    allUsernames.splice(splicePoint, 1);
    console.log(allUsernames);
    Bookmark.update({objectID: bookmark.objectID}, 
      {title: bookmark.title, 
      url: bookmark.url, 
      author: bookmark.author, 
      created_at: bookmark.created_at,
      objectID: bookmark.objectID, 
      usernames: allUsernames}, {upsert: true}, function(err, result) {
        if (err) console.log(err);
    });
  })
};

module.exports = Bookmark;

