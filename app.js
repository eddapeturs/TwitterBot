var Twitter = require('twitter');
var config = require('./config.js');
var fact = require('./factory.js');
var Buffer = require('buffer').Buffer;
var Iconv  = require('iconv').Iconv;
var iconv = new Iconv('ISO-8859-1', 'UTF-8');   // from UFT-8 to ISO
// var server = require('http').createServer();
// var io = require('socket.io')(client);
// const io = require('socket.io-client');

// var socket = io.connect('http://localhost:9000' );
// io.on('connection', function(client){
//     client.on('event', function(data){
//         console.log('Connected! : ', data);
//     });
//     client.on('disconnect', function(){});
// });
// server.listen(9000);
//
// io.sockets.emit('hi', 'everyone');

var T = new Twitter(config);
var parsedTweet;
var userIds; // all users to follow

var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
if (millisTill10 < 0) {
    millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}

// Tweet once a day
setTimeout(function() {
        // Tweet random bullshit
        var randStat = fact.getRandPhrase();
        T.post('statuses/update', { status: randStat })
         // restart connection here with new userlist
    }, millisTill10);

// DEV Stuff tbd
var userId = '3302852710';
// Get all followers

getFollowers()
    .then(startStream)
    .catch(function(err){
        console.log('Any error handling here bla: ', err);
    });

// function handleError(err){
//     console.log('Handling error?', err);
// }

var params = {
    q: '#nodejs',
    count: 10,
    result_type: 'recent'
    // lang: 'en'
};

// T.get('search/tweets', params, function(err, data, response) {
//     if(!err){
//         // console.log('Data: ', data);
//         // This is where the magic will happen
//     } else {
//         console.log(err);
//     }
// });



function getFollowers(){
    var promise = new Promise(function (resolve, reject) {
        var params = {
            screen_name: 'eddapeturs',
            stringify_ids: true
        };

        // T.get('followers/ids', params, function (err, data) {
        //     console.log('data', data);
        //     ids = data.ids;
        //     resolve(ids)
        //     // if(err){
        //         reject(err);
        //     // }
        // });

        var ids = fact.getIds();
        console.log('ids: ', ids);
        if(ids){ resolve(ids); }
        else if(!ids)
            { reject(); }

    });
    return promise;
}

// Start streaming content from all user following bot
function startStream(userIds){

    // console.log('userIds before: ', userIds);
    var params = {
        follow: userIds.toString()
    };
    // console.log('params: ', params);
    // var stream = T.stream('statuses/filter', {track: 'tag, parse', follow: userIds}); // add tag and parse later
    // console.log('userids: ', userIds);
    // var stream = T.stream('statuses/filter', { follow: userIds.toString() });
    var stream = T.stream('statuses/filter', params);

    stream.on('data', function (tweet) {
        if (userIds.indexOf(tweet.user.id_str) > -1) {
            console.log('INCOMING: ', tweet.user.name + ": " + tweet.text)
            var stripped = stripCommand(tweet.text);
            console.log('stripped: ', stripped);
            // getParsedString(stripped)
        }
    });
}

// Update status
function updateStatus(obj){
    var params = {
        status: '@' + obj.username + ' ' + obj.text
    };

    T.post('statuses/update', params);
}


// Parse the string using IceNLP
function getProcessedString(text){
    fact.getParsedString(text)
        .then(function(data){
                var newStr = data.toString();
                var jsonStr = JSON.parse(newStr)
                console.log('JsonTagg: ', jsonStr.tagg);
            },
            function(err){
                console.log('Error: ', err);
            })
}

// Function to remove 'tag' or 'parse' commands from tweet and save it
function stripCommand(originalTweet){
    var str;
    var obj = {
        text: '',
        type: ''
    };

    var tweet = originalTweet.toLowerCase();
    if(tweet.includes(' -t ')){
        str = tweet.replace(' -t ', '');        // replace 'tag' with nothing
        obj.text = str;
        obj.type = 'tagg'
    }
    else if(tweet.includes(' -p ')){
        str = tweet.replace(' -p ', '');
        obj.text = str;
        obj.type = 'parse';
    }
    return obj;
}


function getParsedText(text){
    getProcessedString(text)
        .then(function(data){
            var newStr = data.toString();
            var jsonStr = JSON.parse(newStr)
            // console.log('JsonTagg: ', jsonStr.tagg);
            return jsonStr.parse;
        });
}

function getTaggedText(text){
    getProcessedString(text)
        .then(function(data){
            var newStr = data.toString();
            var jsonStr = JSON.parse(newStr)
            // console.log('JsonTagg: ', jsonStr.tagg);
            return jsonStr.tagg;
        });
}


testFactory();
function testFactory(){
    var text = "Hello my name is John";
    fact.getParsedString(text)
        .then(function(succ){
            console.log('succ', succ);
            var buffer = iconv.convert(succ);
            var newStr = buffer.toString();
            console.log('NewStr: ', newStr)
            // return JSON.parse(newStr);

        }, function(err){
            console.log('errTweet: ', err);
        })
}
