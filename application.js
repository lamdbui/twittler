window.visitor;

function refreshCurrentTweets() {
  let $node = $('.feed');
  let tweets = streams.home;
  for (let i = 0; i < tweets.length; i++) {
    var tweet = tweets[i];
    var $tweet = $('<div></div>');
    $tweet.text('@' + tweet.user + ': ' + tweet.message);
    $tweet.prependTo($node);
  }
}

$(document).ready(function(){
  let $feed = $('.feed');

  // configure our initial page state
  $('.new_tweet_form').hide();

  // set click handlers
  $('.refresh').on('click', function() {
    refreshCurrentTweets();
  });
  $('.new_tweet').on('click', function() {
    $('.new_tweet_form').slideToggle();
  });
  $('.new_tweet_form').submit(function(event) {
    // NOTE: this is important to prevent default form submission handling
    event.preventDefault();

    let inputData =  $('.new_tweet_form :input').serializeArray();
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
      $('.new_tweet_form').slideUp();
    }, 1000);
  });

  refreshCurrentTweets();
});
