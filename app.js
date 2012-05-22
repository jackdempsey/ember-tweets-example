(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.App = Em.Application.create();

  App.Tweet = Em.Object.extend({
    avatar: null,
    screen_name: null,
    text: null,
    date: null
  });

  App.SearchTextField = Em.TextField.extend({
    insertNewline: function() {
      return App.tweetsController.loadTweets();
    }
  });

  App.tweetsController = Em.ArrayController.create({
    content: [],
    username: '',
    loadTweets: function() {
      var url, username,
        _this = this;
      username = this.get('username');
      if (username) {
        url = 'http://api.twitter.com/1/statuses/user_timeline.json';
        url += '?screen_name=%@&callback=?'.fmt(this.get('username'));
        App.recentUsersController.addUser(username);
        return $.getJSON(url, function(data) {
          _this.set('content', []);
          return $(data).each(function(index, value) {
            var t;
            t = App.Tweet.create({
              avatar: value.user.profile_image_url,
              screen_name: value.user.screen_name,
              text: value.text,
              date: value.created_at
            });
            return _this.pushObject(t);
          });
        });
      }
    }
  });

  App.recentUsersController = Em.ArrayController.create({
    content: [],
    addUser: function(name) {
      if (this.contains(name)) this.removeObject(name);
      return this.pushObject(name);
    },
    removeUser: function(view) {
      return this.removeObject(view.context);
    },
    searchAgain: function(view) {
      App.tweetsController.set('username', view.context);
      return App.tweetsController.loadTweets();
    },
    reverse: (function() {
      return this.toArray().reverse();
    }).property('@each')
  });

}).call(this);
