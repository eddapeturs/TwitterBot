# TwitterBot

This is a repo for a Twitter bot that listens to tweets, parses and tags the content using [IceNLP](http://www.malfong.is/index.php?pg=icenlp&lang=en), and replies to the user that posted.


## About

The bot is written in JavaScript and runs using the server-side scripting framework Node.

## Initialization

##### Prerequisites:
- A machine with NodeJS installed and the ability to use the Node Package Manager (NPM).
- A Twitter account with developer privileges

### Getting started:
1. To get started, clone the repo and open in a JS IDE such as Webstorm.
2. Run "npm install" in the command line to install all the necessary packages

#### Before serving make sure you:
1. Add your own credentials to config.js. These can be found under your Twitter Application on your developer account. This is done to connect to the TwitterAPI and listen to a stream.

```javascript
module.exports = {
    consumer_key:         'your_consumer_key',
    consumer_secret:      'your_consumer_secret',
    access_token_key:     'your_access_token',
    access_token_secret:  'your_access_token_secret'
};
```
2. In app.js, change the ID of the user you wish to stream. Now it's my bot, so without changing it you will only listen to activity connected to @malfridurBot. If you're having trouble finding your ID, you can [do so here](http://mytwitterid.com/).


```javascript
  var botId = 'any_id';
```


This implementation assumes you have a running IceNLP server locally. Click here for instructions.

You can test out the functionality without IceNLP using the testWithoutIceNLP() function. To use it, comment out the startStream() function and comment in the testWithoutIceNLP() function. This only uses a hard coded string returned from the factory, but uses most of the functions in the app.js.




[request]: https://github.com/eddapeturs/TwitterBot/blob/master/images/hvernigHefur.png "Requesting Bot"
[response]: https://github.com/eddapeturs/TwitterBot/blob/master/images/Mallaresponse.jpg "Bot response"
