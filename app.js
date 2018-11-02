var Twitter = require('twitter');
var config = require('./config.js');
var fact = require('./factory.js');
// var Buffer = require('buffer').Buffer;
var Iconv  = require('iconv').Iconv;
var iconv = new Iconv('ISO-8859-1', 'UTF-8');   // from UFT-8 to ISO
var T = new Twitter(config);

startStream();

// Start streaming content from all user following bot
function startStream(){
    console.log('Starting server');
    var params = {
        follow: '1056869573008506880'
    };

    var stream = T.stream('statuses/filter', params);

    stream.on('data', function (tweet) {

        if(tweet.in_reply_to_user_id_str == '1056869573008506880'){
            console.log('In reply to: ', tweet.in_reply_to_user_id_str);
            getProcessedString(stripCommand(tweet))
                .then(createResponse)
                .then(updateStatus)
                .catch(function(err){
                    console.log('Error: ', err);
                });
        }
    });
}

// Parse the string using IceNLP
function getProcessedString(object){
    return fact.getParsedString(object.text)
        .then(function(data){
                var newStr = data.toString();
                var jsonStr = JSON.parse(newStr);
                object.jsonString = jsonStr;
                return object;
            },
            function(err){
                console.log('Error: ', err);
            })
}

// Update status
function updateStatus(tweetArray){
    for(var i in tweetArray){
        console.log('TA: ', tweetArray[i]);
        var params = {
            status:  tweetArray[i]
        };
        T.post('statuses/update', params);
    }
}


function createResponse(obj){
    var promise = new Promise(function (resolve, reject) {
        var username = obj.username;
        var taggedStr;
        var parsedStr;
        var objArr = [];
        if(obj.type == 'tp'){
            taggedStr = obj.jsonString ['tagg'];
            parsedStr = obj.jsonString ['parse'];
        }else if(obj.type == 'tagg'){
            taggedStr = obj.jsonString ['tagg'];
        } else if(obj.type == 'parse'){
            parsedStr = obj.jsonString ['parse'];
        } else if (obj.type == 'noTag'){
            objArr.push(username + 'skipun vantar, vinsamlegast bættu við -t eða -p.')
        }


        if(parsedStr && parsedStr.length > 280  - username.length){
            var splitArray = splitHelper(parsedStr);
            for(var i in splitArray){
                objArr.push(splitArray[i]);
            }
        } else if( parsedStr ) {
            objArr.push(username + parsedStr);
        }

        if(taggedStr && taggedStr.length > 280 - username.length){
            var splitArray = splitHelper(taggedStr);
            for(var i in splitArray){
                objArr.push(splitArray[i]);
            }
        }
        else if( taggedStr ) {
            objArr.push(username + taggedStr);
        }

        if( objArr ){
            resolve(objArr);
        } else {
            reject();
        }


        function splitHelper(string){
            var splitArr = [];
            var max = 280 - username.length;

            var count = max;
            var length = string.length;

            while(count < (length + max)){
                var tweet = string.substring(count-max, count);
                splitArr.push(username + tweet);
                count += max;
            }
            return splitArr;
        }
    });
    return promise;
}




// Function to remove 'tag' or 'parse' commands from tweet and save it
function stripCommand(tweet){
    var obj = {
        username: '@' + tweet.user.screen_name + ' ',
        text: '',
        type: ''
    };

    var tw = tweet.text.toLowerCase();
    tw = tw.replace('@malfridurbot', '');
    if(tw.includes('-t') && tw.includes('-p')){
        var tmpStr;
        tmpStr = tw.replace('-t', '');
        obj.text = tmpStr.replace('-p', '');
        obj.type = 'tp';

    }
    else if(tw.includes('-t')){
        obj.text = tw.replace('-t', '');        // Replace '-t' with nothing
        obj.type = 'tagg'                        // Give correct type for return
    }
    else if(tw.includes('-p')){
        obj.text = tw.replace('-p', '');
        obj.type = 'parse';
    } else {
        obj.text = tw;
        obj.type = 'noTag';
    }
    return obj;
}


var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0) - now;
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


// testFactory();
// function testFactory(){
//     var text = "Hello my name is Carl";
//     fact.getParsedString(text)
//         .then(function(succ){
//             console.log('succ', succ);
//             var buffer = iconv.convert(succ);
//             var newStr = buffer.toString();
//             console.log('NewStr: ', newStr)
//             // return JSON.parse(newStr);
//
//         }, function(err){
//             console.log('errTweet: ', err);
//         })
// }

// testCode();
//
function testCode(){
    var tweet = {
        text: "@MalfridurBot gamla gamla það þó ekki hafa verið staðfest -t",
        user: {
            name: "botthildur"
        }
    };
    getProcessedString(stripCommand(tweet))
        .then(createResponse)
        // .then(updateStatus)
        .catch(function(err){
            console.log('Error: ', err);
        });
}
