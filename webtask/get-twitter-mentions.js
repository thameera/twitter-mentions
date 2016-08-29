'use latest';

const jwt = require('jsonwebtoken');
const request = require('request');
const Twit = require('twit');
const _ = require('lodash@4.8.2');

const verifyJWT = (idToken, clientSecret, cb) => {
  return jwt.verify(idToken, new Buffer(clientSecret, 'base64'), (err, decoded) => {
    return cb(err, decoded);
  });
};

const getAccessToken = (clientId, clientSecret, cb) => {
  const options = {
    url: 'https://tham-projects.auth0.com/oauth/token',
    json: {
      audience: 'https://tham-projects.auth0.com/api/v2/',
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    }
  };

  return request.post(options, (err, res, body) => {
    if (err) return cb(err);
    return cb(null, body.access_token);
  });
};

const getUserProfile = (userId, accessToken, cb) => {
  const options = {
    url: `https://tham-projects.auth0.com/api/v2/users/${userId}`,
    json: true,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  return request.get(options, (err, res, body) => {
    if (err) return cb(err);
    return cb(null, body.identities[0].access_token, body.identities[0].access_token_secret);
  });
};

const getMentions = (consumerKey, consumerSecret, accessToken, accessTokenSecret, cb) => {
  const T = new Twit({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
    timeout_ms: 3000
  });

  return T.get('statuses/mentions_timeline', {include_entities: false, count: 200}, (err, data) => {
    return cb(err, data);
  });
};

const numOfOccurrences = (arr, val) => arr.reduce((n, v) => {
  return (v === val) ? n + 1 : n;
}, 0);

const sortedCount = arr => {
  const counts = _.uniq(arr).map(val => {
    return {
      name: val,
      count: numOfOccurrences(arr, val)
    };
  });

  return _.orderBy(counts, ['count', 'name'], ['desc', 'asc']);
};

module.exports = (context, cb) => {
  const idToken = context.data.token;
  let userId;

  const afterMentions = (err, mentions) => {
    if (err) return cb(err);
    const counts = sortedCount(mentions.map(m => m.user.screen_name));
    cb(null, counts);
  };

  const afterUserProfile = (err, token, tokenSecret) => {
    if (err) return cb(err);
    getMentions(context.data.CONSUMER_KEY, context.data.CONSUMER_SECRET, token, tokenSecret, afterMentions);
  };

  const afterAccessToken = (err, accessToken) => {
    if (err) return cb(err);
    getUserProfile(userId, accessToken, afterUserProfile);
  };

  const afterVerify = (err, decoded) => {
    if (err) return cb(err);
    userId = decoded.sub;
    getAccessToken(context.data.CLIENT_ID, context.data.CLIENT_SECRET, afterAccessToken);
  }

  verifyJWT(idToken, context.data.ID_TOKEN_CLIENT_SECRET, afterVerify);
}
