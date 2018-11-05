# TwitterBot

This is a repo for a Twitter bot that listens to tweets, parses and tags the content using [IceNLP](http://www.malfong.is/index.php?pg=icenlp&lang=en), and replies to the user that posted.


## About

The bot is written in JavaScript and runs using the server-side scripting framework Node.

## Initialization

##### Prerequisites:
- A machine with NodeJS installed and the ability to use the Node Package Manager (NPM).
- A Twitter account with developer privileges

### Getting started:
#### 1. To get started, clone the repo and open in a JS IDE such as Webstorm.
#### 2. Run "npm install" in the command line to install all the necessary packages
#### 3. Serve the application by running node app.js inside the TwitterBot directory

#### Before serving make sure you:
- Add a config.js file with your twitter credentials. These can be found under your Twitter Application on your developer account. This is done to connect to the TwitterAPI and listen to a stream.

The content of config.js should look like this:
```javascript
module.exports = {
    consumer_key:         'your_consumer_key',
    consumer_secret:      'your_consumer_secret',
    access_token_key:     'your_access_token',
    access_token_secret:  'your_access_token_secret'
};
```
- In app.js, change the ID of the user you wish to stream. Now it's my bot, so without changing it you will only listen to activity connected to @malfridurBot. If you're having trouble finding your ID, you can [do so here](http://mytwitterid.com/).


```javascript
  var botId = 'any_id';
```

This implementation assumes you have a running IceNLP server locally. [Click here for instructions](https://github.com/eddapeturs/nlp).

You can test out the functionality without IceNLP using the testWithoutIceNLP() function. To use it, comment out the startStream() function and comment in the testWithoutIceNLP() function. This only uses a hard coded string returned from the factory, but uses most of the functions in the app.js.




[request]: https://github.com/eddapeturs/TwitterBot/blob/master/images/hvernigHefur.png "Requesting Bot"
[response]: https://github.com/eddapeturs/TwitterBot/blob/master/images/Mallaresponse.jpg "Bot response"
