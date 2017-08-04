function refreshCurrentTweets(node, tweets) {
  for (let i = 0; i < tweets.length; i++) {
    var tweet = tweets[i];
    var $tweet = $('<div></div>');
    $tweet.text('@' + tweet.user + ': ' + tweet.message);
    $tweet.prependTo(node);
  }
}

function createNewTweet(user, message) {
  let tweet = {};
  tweet.user = user;
  tweet.message = message;
  tweet.date = new Date();
  addTweet(tweet);
  refreshCurrentTweets($feed, streams.home);
}

$(document).ready(function(){
  //let $body = $('body');
  let $feed = $('.feed');

  // configure our initial page state
  $('.new_tweet_form').hide();

  // set click handlers
  $('.refresh').on('click', function() {
    refreshCurrentTweets($feed, streams.home);
  });
  $('.new_tweet').on('click', function() {
    $('.new_tweet_form').slideToggle();
  });
  $('.new_tweet_form').submit(function() {
    // let user = $('#username').val();
    // let message = $('#message').val();
    // let user = document.findElementsByName('username');
    // let message = document.findElementsByName('message');
    let inputData =  $('.new_tweet_form :input').serializeArray();
    // TODO: should we do some validation here?
    createNewTweet(inputData[0].value, inputData[1].value);
    setTimeout(function() {
      $('.new_tweet_form').slideUp();
    }, 1000);
  });
  // $('.new_tweet_submit').on('click', function() {
  //   //TODO: Add a slick notification message
  //   let user = $()
  //   createNewTweet
  //   setTimeout(function() {
  //     $('.new_tweet_ui').slideUp();
  //   }, 1000);
  // });

  refreshCurrentTweets($feed, streams.home);

});
