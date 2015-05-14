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
Bookmark.prototype.updateBookmarks = function (bookmarks, username, callback){
  //if bookmark exists, update with userID
  //else call addBookmark method
  var lastBookmark = bookmarks[bookmarks.length-1];
  //try to find the most recently clicked article in db by its ID
  Bookmark.findOne({objectID: lastBookmark.objectID}, 'usernames', function (err, result) {
    var allUsernames;
    if (err) console.log(err);
    //if article is not in db 
    if (!result) {s
      allUsernames = [];
    } else {
    //if article in db, then allUsernames is the result.usernames array
      //console.log('THIS IS THE RESULT OF FINDONE', result.usernames);
      allUsernames = result.usernames;
    }
    //regardless, add username to array, and upsert the article
    allUsernames.push(username);
    console.log(allUsernames);
    Bookmark.update({objectID: lastBookmark.objectID}, 
      {title: lastBookmark.title, 
      url: lastBookmark.url, 
      author: lastBookmark.author, 
      created_at: lastBookmark.created_at,
      objectID: lastBookmark.objectID, 
      usernames: allUsernames}, {upsert: true}, function(err, result) {
        if (err) console.log(err);
    });
  })
};

module.exports = Bookmark;

