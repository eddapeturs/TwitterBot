var Twitter = require('twitter');
var config = require('./config.js');
var fact = require('./factory.js');

var T = new Twitter(config);


var params = {
    q: '#nodejs',
    count: 10,
    result_type: 'recent'
    // lang: 'en'
}

T.get('search/tweets', params, function(err, data, response) {
    if(!err){
        // console.log('Data: ', data);
        // This is where the magic will happen
    } else {
        console.log(err);
    }
})

var users = ["3302852710"];

var stream = T.stream('statuses/filter', {track: '#malfridur'});
stream.on('data', function (tweet) {
//     if (users.indexOf(tweet.user.id_str) > -1) {
        console.log(tweet.user.name + ": " + tweet.text);
        // T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
        //     console.log(data)
        // })
    // }
})

//
// T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//     console.log(data)
// })