var Bookmark = require('./bookmarksModel.js');

module.exports = {
   updateBookmarks: function(request, response, next) {
    //console.log('in server!!!', request.body.username, request.body.bookmarks);
    var username = request.body.username;
    var bookmarks = JSON.parse(request.body.bookmarks);

    Bookmark.prototype.updateBookmarks(bookmarks, username, function(err, results){
      if(!err){
        console.log('Bookmark data updated');
        response.status(200).end();
      } else {
        console.log('Bookmark data update ERROR');
        response.status(400).send(err);
      }
    });
  }
};