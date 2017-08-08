window.visitor;

var currentTweetCount = 0;

var refreshCurrentTweets = function() {
  let $node = $('.feed');
  let tweets = streams.home;
  for (let i = 0; i < tweets.length; i++) {
    var tweet = tweets[i];
    var $tweet = $('<div class="tweet"></div>');
    var $tweetUsername = $('<a class="username" href="#">@HLS</a>');
    //var $tweetDate = $('<')
    var $tweetMessage = $('<p>MESSAGE</p>');
    //$tweet.text('@' + tweet.user + ': ' + tweet.message);
    $tweetUsername.text('@' + tweet.user);
    $tweetMessage.text(tweet.message);
    $tweet.prependTo($node);
    $tweetUsername.appendTo($tweet);
    $tweetMessage.appendTo($tweet);
  }
  $('.tweet:odd').css('background-color', '#DDD');
  $('.tweet:even').css('background-color', '#FFF');
  //$('.tweet:odd').css('{"background-color": "#DDD"}');
  //$('.tweet:odd').addClass('.tweet-light');
  //$('.tweet:even').addClass('.tweet-dark');
  currentTweetCount = tweets.length;
}

var checkForNewTweets = function(timeInterval) {
  // check for new tweets every 5 seconds
  timeInterval = timeInterval || 5000;

  let numOfNewTweets = streams.home.length - currentTweetCount;

  $('.feed_status').text('Click to update ' + numOfNewTweets + ' new tweets');

  if (numOfNewTweets === 0) {
    $('.feed_status').slideUp();
  } else {
    $('.feed_status').slideDown();
  }

  setTimeout(checkForNewTweets, timeInterval);
}

$(document).ready(function(){
  let $feed = $('.feed');

  // configure our initial page state
  $('#new_tweet_form').hide();
  $('.feed_status').hide();

  // set click handlers
  $('#refresh_tweets_button').on('click', function() {
    refreshCurrentTweets();
  });
  $('.feed_status').on('click', function() {
    refreshCurrentTweets();
  });
  $('#new_tweet_button').on('click', function() {
    $('#new_tweet_form').slideToggle();
  });
  // $('#refresh').on('click', function() {
  //   refreshCurrentTweets();
  // });
  // $('#new_tweet').on('click', function() {
  //   $('#new_tweet_form').slideToggle();
  // });
  $('#new_tweet_form').submit(function(event) {
    // NOTE: this is important to prevent default form submission handling
    event.preventDefault();

    let inputData =  $('#new_tweet_form :input').serializeArray();
    visitor = inputData[0].value;
    let message = inputData[1].value;

    if (visitor.length && message.length) {
      // create a new user, if there isn't one already
      if (!streams.users.hasOwnProperty(visitor)) {
        streams.users[visitor] = [];
      }
      writeTweet(message);
    }
    setTimeout(function() {
      $('#new_tweet_form').slideUp();
    }, 1000);

    currentTweetCount = stream.home.length;
  });

  refreshCurrentTweets();
  checkForNewTweets();
});
