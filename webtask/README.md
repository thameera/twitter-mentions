# Webtask

This directory contains the source code for the webtask that needs to be deployed to [webtask.io](https://webtask.io).

## Prerequisites

* You need to have an Auth0 account. In Auth0, you need to create a non-interactive client and enable Management API in the APIs section with `read:user_idp_tokens` scope.
* Install `wt-cli` as documented [here](https://webtask.io/cli).
* Create a Twitter app [here](https://apps.twitter.com/app/new).

## Create webtask

Use this command to create/deploy the webtask.

```
wt create \
  --secret ID_TOKEN_CLIENT_SECRET=<authenticating app client secret here> \
  --secret CLIENT_ID=<non-interactive app client id> \
  --secret CLIENT_SECRET=<non-interactive app client secret> \
  --secret CONSUMER_KEY=<Twitter app's consumer key> \
  --secret CONSUMER_SECRET=<Twitter app's consumer secret> \
  get-twitter-mentions.js
```

Explanations of required secrets:

* `ID_TOKEN_CLIENT_SECRET`: Client secret of the Auth0 client used by frontend
* `CLIENT_ID`, `CLIENT_SECRET`: Client ID/secret pair of non-interactive app created in Auth0
* `CONSUMER_KEY`, `CONSUMER_SECRET`: Consumer key/secret pair of your Twitter app

## Update webtask

Use this command to update the webtask after changes. It will also watch the file for changes and update the webtask automatically.

```
wt update --watch get-twitter-mentions get-twitter-mentions.js
```
