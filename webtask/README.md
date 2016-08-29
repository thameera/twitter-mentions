## Create webtask

```
wt create --secret ID_TOKEN_CLIENT_SECRET=<authenticating app client secret here> --secret CLIENT_ID=<non-interactive app client id> --secret CLIENT_SECRET=<non-interactive app client secret> --secret CONSUMER_KEY=<Twitter app's consumer key> --secret CONSUMER_SECRET=<Twitter app's consumer secret> get-twitter-mentions.js
```

## Update webtask

```
wt update --watch get-twitter-mentions get-twitter-mentions.js
```
