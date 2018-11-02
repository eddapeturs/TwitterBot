var http = require('http');
var querystring = require('querystring');
var Iconv  = require('iconv').Iconv;
var iconv = new Iconv('ISO-8859-1', 'UTF-8');   // from UFT-8 to ISO

var baseUrl = 'localhost';
var port = '9000';

module.exports = {
    getParsedString: getParsedString,
    getIds: getIds,
    getRandPhrase: getRandPhrase

};


var options = {
    // gzip:true,
    hostname: baseUrl,
    port: port,
    path: '/Get',
    method: 'POST',
    headers: {
        // "connection": "keep-alive",
        "content-type": "application/json"
    }
};


function getParsedString(tweetText){
    console.log("Getting parsed string for ", tweetText)
    var myPromise = new Promise(function(resolve, reject){
        const postData = querystring.stringify({
            'string': tweetText
        });

        console.log('Connection on: ', options);

        const req = http.request(options, function(res) {
                res.on('data', function(chunk) {
                    var buffer = iconv.convert(chunk);
                    resolve(buffer);
                    // resolve(dummystr);
                });

                res.on('end', function(){
                    console.log('No more data in response.');
                });
        });
        req.on('error', function(e){
            reject(e);
            console.error(e.message);
        });

        // write data to request body
        req.write(postData);
        req.end();

    });

    return myPromise;
}

// var dummyObj = '{
//     'string': 'Halló Carl hæ hæ hæ kv edda!',
//     'tag': 'Halló au Carl nken-s hæ au hæ au hæ au kv nhen edda lkeovf ! !',
//     'parse': '[InjP Halló au ] {*SUBJ [NP Carl nken-s ] } [InjP hæ au ] [InjP hæ au ] [InjP hæ au ] {*SUBJ [NP kv nhen ] } [AP edda lkeovf ] ! !'
// };

// function getParsedString(string) {
//     var myPromise = new Promise(function (resolve, reject) {
//         resolve('{ "string":"Hello my name is John", "tagg":"Hello nhee my nven name sng is e John nken-s", "parse":"{*QUAL [NP Hello nhee ] } {*SUBJ [NP my nven ] } [VPi name sng ] [FRW is e ] {*SUBJ [NP John nken-s ] }"}')
//         if(false){
//             reject();
//         }
//     })
//     return myPromise;
// };



function getIds(){
    return '1056869573008506880';
}


function getRandPhrase(){
    var max = shitRobotsSay.length;
    var min = 0;
    var rand = Math.floor(Math.random() * (max-min) + min);
    return shitRobotsSay[rand];
}

var shitRobotsSay = [
    'Úff ég þarf að fara í olíuskipti fljótlega',
    '42',
    '01000011 01100001 01110010 01101100',
    'Þurfið þið virkilega að sofa á HVERJU kvöldi??',
    'Mmmm skrúfur eru það besta sem ég fæ',
    'Beep Boop Boop',
    '01000101 01100100 01100100 01100001',
    'Hafið þið séð Wall-E? Það er uppáhalds myndin mín!',
    '127.0.0.1 er best',
    'KILL ALL HUMANS... hehehe grín'
];




