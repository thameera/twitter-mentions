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

  var show_logged_in = function() {
    $('#login').hide();
    $('#authorized').show();
  };

  var show_sign_in = function() {
    $('#login').show();
    $('#authorized').hide();
  };

  var parseHash = function() {
    var token = localStorage.getItem('id_token');
    if (null != token) {
      show_logged_in();
    } else {
      var result = auth0.parseHash(window.location.hash);
      if (result && result.idToken) {
        localStorage.setItem('id_token', result.idToken);
        show_logged_in();
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
