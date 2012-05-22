root = exports ? this
# Application
root.App = Em.Application.create()
#
# Models
App.Tweet = Em.Object.extend
  avatar: null
  screen_name: null
  text: null
  date: null

# Views
App.SearchTextField = Em.TextField.extend
  insertNewline: -> App.tweetsController.loadTweets()

#
# Controllers
App.tweetsController = Em.ArrayController.create
  content: []
  username: ''
  loadTweets: ->
    username = @get 'username'
    if username
      url = 'http://api.twitter.com/1/statuses/user_timeline.json'
      url += '?screen_name=%@&callback=?'.fmt(@get('username'))
      App.recentUsersController.addUser username
      $.getJSON url, (data) =>
        @set 'content', []
        $(data).each (index, value) =>
          t = App.Tweet.create
            avatar: value.user.profile_image_url
            screen_name: value.user.screen_name
            text: value.text
            date: value.created_at
          @pushObject t

App.recentUsersController = Em.ArrayController.create
  content: []
  addUser: (name) ->
    @removeObject name if @contains name
    @pushObject name
  removeUser: (view) ->
    @removeObject view.context
  searchAgain: (view) ->
    App.tweetsController.set 'username', view.context
    App.tweetsController.loadTweets()
  reverse: (->
    @toArray().reverse()
  ).property '@each'


