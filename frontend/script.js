$(function() {

  var auth0 = null;
  auth0 = new Auth0({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    callbackOnLocationHash: true,
    callbackURL: AUTH0_CALLBACK_URL
  });

  var authorize = function() {
    auth0.login({
      connection: 'twitter'
    }, function(err) {
      if (err) console.log("something went wrong: " + err.message);
    });
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = '/';
  };

  var show_logged_in = function(idToken) {
    $('#login').hide();
    $('#authorized').show();
    getMentions(idToken);
  };

  var show_sign_in = function() {
    $('#login').show();
    $('#authorized').hide();
  };

  var getMentions = function(idToken) {
    var url = 'https://webtask.it.auth0.com/api/run/wt-thameera-auth0_com-0/get-twitter-mentions?webtask_no_cache=1';
    $.post(url, {
      token: idToken
    })
      .done(function(res) {
        console.log(res);
        var text = res.map(function(x) {
          return '<a href="https://twitter.com/' + x.name + '">' + x.name + '</a/> [' + x.count + ']';
        }).join(', ');
        $('#mentions').html(text);
      })
      .fail(function(err) {
        console.log('err');
        console.error(err);
        if (err.responseJSON && err.responseJSON.name === 'TokenExpiredError') {
          localStorage.removeItem('id_token');
          show_sign_in();
        }
      });
  };

  var parseHash = function() {
    var token = localStorage.getItem('id_token');
    if (null != token) {
      show_logged_in(token);
    } else {
      var result = auth0.parseHash(window.location.hash);
      if (result && result.idToken) {
        localStorage.setItem('id_token', result.idToken);
        show_logged_in(result.idToken);
      } else if (result && result.error) {
        console.log('error: ' + result.error);
        show_sign_in();
      } else {
        show_sign_in();
      }
    }
  };

  $('#authorize').click(authorize);
  $('#logout').click(logout);

  parseHash();

});
