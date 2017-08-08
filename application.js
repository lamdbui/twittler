window.visitor;

var currentTweetCount = 0;

var refreshTweetTimeElapsed = function() {
  let tweets = streams.home;
  for (let i = 0; i < tweets.length; i++) {
    let timeDifferenceStr = moment(tweet.created_at).fromNow();
    //let $tweetDate = $('<p class="date"></p>');
    tweets[i].created_at()
  }
}

var refreshTweetTime = function(dateNode) {
  let timeDifferenceStr = moment(tweet.created_at).fromNow();
  dateNode.text(' - '.concat(timeDifferenceStr));
}

var refreshCurrentTweets = function() {
  let $node = $('.feed');
  let tweets = streams.home;
  for (let i = currentTweetCount; i < tweets.length; i++) {
    let tweet = tweets[i];
    let timeDifferenceStr = moment(tweet.created_at).fromNow();
    let $tweet = $('<div class="tweet"></div>');
    let $tweetUsername = $('<a class="username" href="#">@HLS</a>');
    let $tweetDate = $('<p class="date"></p>');
    let $tweetMessage = $('<p class="message"></p>');

    $tweetUsername.text('@' + tweet.user);
    $tweetDate.text(' - '.concat(timeDifferenceStr));
    $tweetMessage.text(tweet.message);
    $tweet.prependTo($node);
    $tweetUsername.appendTo($tweet);
    $tweetDate.appendTo($tweet);
    $tweetMessage.appendTo($tweet);
  }
  $('.tweet:odd').css('background-color', '#DDD');
  $('.tweet:even').css('background-color', '#FFF');
  currentTweetCount = tweets.length;
}

var checkForNewTweets = function(timeInterval) {
  // check for new tweets every 5 seconds
  timeInterval = timeInterval || 5000;

  let numOfNewTweets = streams.home.length - currentTweetCount;

  $('.feed_status').text('Click to update ' + numOfNewTweets + ' new tweets');

  if (numOfNewTweets > 0) {
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
    $(this).slideUp();
    refreshCurrentTweets();
  });
  $('#new_tweet_button').on('click', function() {
    $('#new_tweet_form').slideToggle();
  });
  $('#new_tweet_form').submit(function(event) {
    // NOTE: this is important to prevent default form submission handling
    event.preventDefault();

    currentTweetCount = streams.home.length;

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
    $('#new_tweet_form').slideUp();
    // setTimeout(function() {
    //   $('#new_tweet_form').slideUp();
    // }, 1000);
  });

  refreshCurrentTweets();
  checkForNewTweets();
});
