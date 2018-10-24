var http = require('http');
// var Iconv = require('iconv');
var querystring = require('querystring');
var Buffer = require('buffer').Buffer;
var Iconv  = require('iconv').Iconv;
var iconv = new Iconv('ISO-8859-1', 'UTF-8');   // from UFT-8 to ISO

// Move to ENV!
var baseUrl = '130.208.244.107';
var port = '9000';
var parsedTweet;

module.exports = {
    getParsedString: getParsedString,
    getIds: getIds,
    getRandPhrase: getRandPhrase

};


var options = {
    hostname: baseUrl,
    port: port,
    path: '/Get',
    method: 'POST',
    headers: {
        "content-type": "application/json"
    }
};


function getParsedString(tweetText){
    console.log("Getting parsed string for ", tweetText)
    var myPromise = new Promise(function(resolve, reject){
        const postData = querystring.stringify({
            'string': tweetText
        });

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
    return id;
}

var id = ['1052332676882026497'];

var strId = [
    '1052332676882026497',
    '792522669363167232',
    '309092372',
    '51228116',
    '601782181',
    '726511213933371392',
    '249923195',
    '774306161411719168',
    '937688888671432704',
    '393093749',
    '2656490798',
    '619187360',
    '78050027',
    '809183731789529088',
    '34241646',
    '31031944',
    '3128082607',
    '625395808',
    '2571698401',
    '48360523',
    '410075853',
    '747613681979109376',
    '115431950',
    '291325632',
    '946382419883675648',
    '941351381285462016',
    '934586603103768576',
    '852161491017060352',
    '2411765767',
    '742908526767558656',
    '222445757',
    '913390291993980928',
    '17952989',
    '153060538',
    '913750985201373184',
    '2504639349',
    '236898119',
    '87820072',
    '904376385308938241',
    '131014456',
    '561938865',
    '24180376',
    '112330649',
    '93962860',
    '2409451579',
    '525239492',
    '4784263883',
    '53975261',
    '10587',
    '484414865',
    '799656260769562624',
    '97163065',
    '141836759',
    '3212551858',
    '5805552',
    '366076796',
    '282255179',
    '785802106569494528',
    '196246005',
    '299966843',
    '1178780078',
    '781806931291824128',
    '877331126',
    '555385878',
    '39816782',
    '292916328',
    '59632589',
    '874095085',
    '763398520221077504',
    '3290024876',
    '154634542',
    '1221612805',
    '38940377',
    '87508418',
    '89461567',
    '755437295361200132',
    '70449935',
    '746862983100440577',
    '32117396',
    '42486537',
    '135337008',
    '4277959407',
    '230759450',
    '4828804679',
    '727194323079585792',
    '85317978',
    '856037461',
    '4594309996',
    '102979946',
    '23629347',
    '82926219',
    '718210621699960832',
    '31802472',
    '49394220',
    '980260886',
    '300575202',
    '31141533',
    '3334723203',
    '2615743516',
    '24546446',
    '1052332676882026497'
];

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
    '127.0.0.1 er best'
];




