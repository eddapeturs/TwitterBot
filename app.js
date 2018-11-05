var Twitter = require('twitter');
var config  = require('./config.js');
var fact    = require('./factory.js');
var Iconv   = require('iconv').Iconv;
var iconv   = new Iconv('ISO-8859-1', 'UTF-8');   // from UFT-8 to ISO
var T       = new Twitter(config);

var botId = '1056869573008506880';     // Get ID from factory

startStream();  // Initializing bot

// Start streaming content from all user following bot
function startStream(){
    console.log('Starting NodeJS server');

    var params = { follow: botId };         // listen to activity on @malfridurBot
    var stream = T.stream('statuses/filter', params);

    stream.on('data', function (tweet) {
        if(tweet.in_reply_to_user_id_str === botId){          // make sure Malfridur was tagged
            getProcessedString(stripCommand(tweet))                 // strip command and parse string
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
    return fact.getProcessedString(object.text)
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

// Create response tweet from @malfridurBot
function createResponse(obj){
    var promise = new Promise(function (resolve, reject) {
        var username = obj.username;
        var taggedStr;
        var parsedStr;
        var objArr = [];

        // Processing command type
        if(obj.type == 'tp'){
            taggedStr = obj.jsonString['tagg'];
            parsedStr = obj.jsonString['parse'];
        }else if(obj.type == 'tagg'){
            taggedStr = obj.jsonString['tagg'];
        } else if(obj.type == 'parse'){
            parsedStr = obj.jsonString['parse'];
        } else if (obj.type == 'noTag'){
            objArr.push(username + 'skipun vantar, vinsamlegast bættu við -t eða -p.')
        }

        // Handling long responses
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

        // Split up string into chunks
        function splitHelper(string){
            var splitArr = [];
            var max = 280 - username.length; // username form: '@username ', w. trailing space

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


// Function to remove '-t' or '-p' commands from tweet and save it
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
        obj.type = 'tagg'                       // Give correct type for return
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

// Tweet at 0800hrs
var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0) - now;
if (millisTill10 < 0) {
    millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}

// Tweet once a day something random
setTimeout(function() {
    var randStat = fact.getRandPhrase();
    T.post('statuses/update', { status: randStat })
}, millisTill10);


/************* Testing functions ****************/
/*------- Uncomment function call to try -------*/

// Test a connection with IceNLP server running locally
// testFactory();
function testFactory(){
    var text = "Hér er yndislegt að vera";
    fact.getProcessedString(text)
        .then(function(succ){
            var newStr = succ.toString();
            var jsonStr = JSON.parse(newStr);
            console.log('Returned object:\n ', jsonStr)

        }, function(err){
            console.log('errTweet: ', err);
        })
}

// Creates a dummy tweet, sends to IceNLP server for processing,
// splits up into separate tweets and console logs.
// testCode();
function testCode(){
    var dummyTweet = {
        text: "@MalfridurBot kæra vinkona, ekkert hefur verið staðfest í þeim efnum -t -p",
        user: {
            screen_name: "botthildur"
        }
    };

    var veryLongDummyTweet = {
        text: "@MalfridurBot Núna langar mig að láta reyna á eitt. Ég hef heyrt að þú getir unnið úr löngum strengjum, það er, þegar tíst eru 280 stafir að lengd, og svarið enn lengra. Er þetta rétt? Mér leikur forvitni á að vita þetta. Ef þú vilt vera svo væn að bæði -t og -p þetta, takk fyrir",
        user: {
            screen_name: "botthildur"
        }
    };

    getProcessedString(stripCommand(veryLongDummyTweet))
        .then(createResponse)
        .then(logResponse)
        .catch(function(err){
            console.log('Error: ', err);
        });

    function logResponse(tweetArray){
        for(var i in tweetArray){
            console.log("Reply no.", i, ": ",  tweetArray[i]);
        }
    }
}
