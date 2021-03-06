// init this for usage later
window.visitor;

var currentTweetCount = 0;
// used to keep track of current user for filtering
var currentUser = undefined;

var refreshCurrentTweets = function(user) {
  let $node = $('.feed');
  let tweets = (currentUser === undefined) ? streams.home : streams.users[currentUser];

  // remove previous nodes
  $('.feed').children().remove('.tweet');

  // populate tweets in new nodes
  for (let i = 0; i < tweets.length; i++) {
    let tweet = tweets[i];
    let timeDifferenceStr = moment(tweet.created_at).fromNow();
    let $tweet = $('<div class="tweet"></div>');
    let $tweetUsername = $('<p class="username"></p>');
    let $tweetDate = $('<p class="date"></p>');
    let $tweetMessage = $('<p class="message"></p>');
    let $tweetTimestamp = $('<div class="timestamp"></div>');

    $tweetUsername.text('@' + tweet.user);
    $tweet.attr('id', tweet.user);
    $tweetUsername.on('click', function() {
      let username = $(this).text().substring(1);
      currentUser = username;

      // show filter box
      // use Unicode multiplacation character to represent 'x' to clear filter
      $('.filter').text('\u2716 ' + username);
      $('.filter').slideDown();

      refreshCurrentTweets();
    });
    $tweetDate.text(' - '.concat(timeDifferenceStr));
    $tweetMessage.text(tweet.message);
    $tweetTimestamp.text(tweet.created_at.toDateString());
    $tweet.prependTo($node);
    $tweetUsername.appendTo($tweet);
    $tweetDate.appendTo($tweet);
    $tweetTimestamp.appendTo($tweet);
    $tweetMessage.appendTo($tweet);
  }

  currentTweetCount = tweets.length;

  // hide our 'feed_status', since we updated
  $('.feed_status').slideUp();
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
  $('.filter').hide();

  // set click handlers
  $('#refresh_tweets_button').on('click', function() {
    refreshCurrentTweets();
  });
  $('.feed_status').on('click', function() {
    refreshCurrentTweets();
  });
  $('.filter').on('click', function() {
    currentUser = undefined;
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
    refreshCurrentTweets();
  });

  refreshCurrentTweets();
  checkForNewTweets();
});
