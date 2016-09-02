# Twitter Mentions Analyzer

This projects demonstrates how to use Auth0's social identity provider access token flow when you don't have a backend. Instead, a [webtask](https://webtask.io) is used.

The `frontend` directory contains the app which is a static webapp. It lets the user to sign in with her Twitter account.

The `webtask` directory contains the source code of the webtask that would get Twitter access tokens from Auth0 and use them to query Twitter API for the user's mentions.

When a user signs in from the frontend, the received [JWT](https://jwt.io/) is sent to the webtask via a POST request, which in turn would send back a sorted list of users who have mentioned the signed in user recently.

## How to deploy the webtask

The instructions can be found in `webtask/README.md` file.

## How to serve the frontend

If you have [serve](https://www.npmjs.com/package/serve) installed, you can simply run the `serve` script.

```bash
./serve
```

If you have Python installed, you can also:

```bash
cd frontend
python -m SimpleHTTPServer
```
