/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node slack_bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it is running, and for how long.

  Say: "Call me <nickname>"

  Tell the bot your nickname. Now you are friends.

  Say: "who am I?"

  The bot will tell you your nickname, if it knows one for you.

  Say: "shutdown"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}
if (!process.env.zatudan_apikey) {
    console.log('Error: Specify zatudan_apikey in environment');
    process.exit(1);
}


var Botkit = require('./lib/Botkit.js');
var os = require('os');
var request = require('request');

var CronJob = require('cron').CronJob;
var controller = Botkit.slackbot({
    debug: true,
});


// 環境変数から取得はこっち
var bot = controller.spawn({
    token: process.env.token
}).startRTM();

//
// Cronを使用して定期的につぶやく場合
//var bot = controller.spawn({
//  token: token
//}).startRTM(function(err,bot,payload) {
  // 初期処理
//  if (err) {
//    throw new Error('Could not connect to Slack');
//  }
//毎分とかやりたい場合
//cronTime: '* */1 * * 1-5',
//  new CronJob({
//        cronTime: '* * * * 1-5',
//        onTick: function() {
//                bot.say({
//                        channel: 'sugitest',
//                        text: 'テスト',
//                        username: 'bot001',
//                        icon_url: 'https://avatars.slack-edge.com/2016-11-18/105631624241_6845933554aeaa52de3d_72.jpg'
//                });
//        },
//       start: true,
//        timeZone: 'Asia/Tokyo'
//  });
//});

controller.hears(['hello', 'hi', 'こんにちは', 'テスと'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});



controller.hears(['^何曜日$'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {


    controller.storage.users.get(message.user, function(err, user) {
var dateObj = new Date() ;

// 曜日の表記
var weekDayList = [ "日", "月", "火", "水", "木", "金", "土" ] ;

// 日時の各情報を取得
var year = dateObj.getFullYear() ;	// 年
var month = dateObj.getMonth() + 1 ;	// 月
var date = dateObj.getDate() ;	// 日
var hour = dateObj.getHours() ;	// 時
var minute = dateObj.getMinutes() ;	// 分
var second = dateObj.getSeconds() ;	// 秒
var weekDay = weekDayList[ dateObj.getDay() ] ;	// 曜日

// 表示用に組み立てる ( → 2016年7月2日(土) 15時57分1秒 )
//var date = year + "年" + month + "月" + date + "日(" + weekDay + ")" + hour + "時" + minute + "分" + second + "秒" ;

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, weekDay+"曜日ですよ。"+user.name+"さん。");
        } else {
            bot.reply(message, weekDay+"曜日ですよ。");
        }
    });
    });
});


controller.hears(['^おもしろ$'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
var message_options = [
"ゴリラ豪雨",
"お前がしゃべる時は字幕が必要だな",
"#住所全部晒して同じだったら家族",
"え、図書館で万引きしたの？",
"オフ会でネットカフェって・・・",
"子供店長がうらやましい・・俺なんて大人無職だよ・・・",
"ゴッホ「バッハｗｗｗｗｗｗｗ」",
"俺のけん玉の玉を完熟トマトに換えた奴ちょっとこい",
"結局ポンキッキって開いたの？",
"これは恋？それとモアイ？",
"平安時代の人「ﾎﾎｯｗｗｗｗｗﾏﾛｽｗｗｗｗｗｗｗｗｗ」",
"トゥモローランドに昨日行った",
"TUBE 「冬の良さがわかってきた」",
"チリが内戦で東西に分裂",
"ええいああ君って誰なの？",
"オリージョギダリ「」",
"君に届け(着払い)",
"ハイジ「わーい!クララが立っ・・・・誰だ貴様!!!!」",
"せんとくん「俺のことチョッパーっていうやつなんなの？」",
"大相撲を性の対象として見てる奴ちょっと来い",
"「いう」を「ゆう」ってゆう奴何なの？",
"なんでお相撲さんって賞金取るときフェイント入れるの？",
"ご飯をお代わりしに行ったお爺ちゃんが、未だに行方不明。",
"う〇こ我慢しながら歩いてる友達が武道の達人みたいでワロタ",
"お前、何年耳鼻科かよってるの？",
"遊戯「俺はここでラーメン屋をオープン！！」",
"進撃の暇人",
"ノーブラの反対語はイエスパンティーじゃね",
"神輿担いだ事あるやつちょっとそいや",
"飛び出す絵本開いたら城が目に刺さった",
"すごく怪しい宗教勧誘がきたからデーモン小暮の真似で対抗した",
"謙信「うわっ……私の名字、うえすぎ……？」",
"マルフォイ「こんなもの、フォフォイのフォイだぜ」",
"おもひでぼろんぼろん",
"フライドチキンって、そこも食えるんだ…",
"ハイジ「クララのバカ！いなりずし！」",
"ヒトカラきたのに25人の部屋に通された",
"お布団と結婚したいとか言ってる人けっこういるけど、あいつ誰とでも寝るよ",
"マルフォイ「さぁ今夜も始まりました。テレフォイショッピング」",
"お前、ネットの掲示板だと偉そうだな。",
"節子「なんで蛍すぐ D I E？」",
"お前、ビート板かじるなよ",
"ウルトラマン「３分間待ってやる」",
"トム「そうや」",
"えっ？ここが玄関？",
"どうやら警察に後ろから交尾されてる",
"スタンディングオベーションっていやらしいことじゃなかったの？",
"ええいいああケツからごぼう巻き",
"埃｢吸いたいんだろ？体は掃除機だな｣",
"箸「相棒ー!どこ行ったあいぼおおー!!」",
"えっ？わりばしも洗うの？",
"毟る(むしる)という漢字の残酷さ",
"大根「おろせよ」",
"お前のリコーダーだけ、色違うよな",
"部屋が汚いんじゃない 俺が美しいんだ",
"三日後に返ってきたメールが「ごめん、寝てた。」",
"なんで線香花火からやるんだよ",
"「廃墟を歩こう」的な本に俺の家が掲載されていた",
"偽装表示とか「ごはんですよ」が一番酷いだろ",
"隣人がまた裏声使って彼女いる振りしてる",
"平安時代の不良「てめえ何麻呂だよ」",
"レディーガガの反対ってミスターポポだよな？",
"ひとんちで充電するなよ",
"ジョイ君「滑り止めも落ちとったで」",
"台風はいいよな進路があって",
"あと五分なのにサザンメドレーかよ。",
"お前がベッカムからもらったって言うサイン、カタカナだな",
"なんで眼帯してると誇らしげなの？",
"先生、青のチョーク見にくいです。",
"お前の携帯　他のやつより大きくないか？",
"バレンタインデーに意味なく居残るなよ",
"え、花屋さんが花粉症？"
    ];
    var random_index = Math.floor(Math.random() * message_options.length);
    var chosen_message = message_options[random_index];
    bot.reply(message, chosen_message);
});

/*
 * wikiから指定した文字を検索して結果を表示する
 */
controller.hears(['^(.+)って何$'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
    var thing = message.match[1];
    var encodeThing = encodeURI(thing);
    bot.reply(message, thing + "を調べています...");
    bot.startConversation(message, function (err, convo) {
        var http = require('http');
        http.get("http://wikipedia.simpleapi.net/api?output=json&keyword=" + encodeThing, function (result) {
            var body = '';
            result.setEncoding('utf8');
            result.on('data', function(data) {
                body += data;
            });
            result.on('end', function(data) {
                var v = JSON.parse(body);
                if (v === null) {
                    convo.say(thing + 'が見つかりませんでした。');
                    convo.next();
                } else {
                    convo.say(v[0].body);
                    convo.next();
                }
            });
        });
    });
});

/*
 * 天気を表示する
 */
controller.hears(['^天気$', '^てんき$'], 'direct_message,direct_mention,mention,ambient', function (bot, message) {
    bot.reply(message, "天気情報を取得しています...");
    bot.startConversation(message, function (err, convo) {
        var http = require('http');
        http.get("http://weather.livedoor.com/forecast/webservice/json/v1?city=130010", function (result) {
            var time = new Date();
            var body = '';
            result.setEncoding('utf8');
            result.on('data', function(data) {
                body += data;
            });
            result.on('end', function(data) {
                var v = JSON.parse(body);
                var weather = v.forecasts[0];
                if (time.getHours()+9 < 18) {
                    var weather = v.forecasts[0];
                } else {
                    var weather = v.forecasts[1];
                }
                var str = weather.dateLabel + "の" + v.title + "は" + weather.telop + "です。最高気温は" + weather.temperature.max.celsius + "度です！" + "\n";
                for (var i in v.pinpointLocations) {
                    if(v.pinpointLocations[i].name == "立川市") {
                        var linkStr = v.pinpointLocations[i].name + "(" + v.pinpointLocations[i].link + ")";
                        str = str + "\n" + linkStr;
                    }
                }
                convo.say(str);
                convo.next();
            });
        });
    });
});

controller.hears(['call me (.*)', 'my name is (.*)', '名前変更 (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i', '名前覚えて', '私の名前', 'call me', 'callme'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'あなたのお名前は ' + user.name + ' です。');
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('まだ聞いてないから分かりません。');
                    convo.ask('早く教えて？', function(response, convo) {
                        convo.ask('`' + response.text + '`って呼んでいいの？', [
                            {
                                pattern: 'yes|ok|OK|いいよ|おｋ|うん|オッケー|おっけー|はい',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no|だめ',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.say('yesかnoで答えなさい');
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'ＯＫ！覚えました！');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'あなたの名前は ' + user.name + ' です。');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'ＯＫ！見なかったことにします。');
                        }
                    });
                }
            });
        }
    });
});

controller.hears(['名前変更'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.ask('変更後の名前は？？', function(response, convo) {
                        convo.ask('本当に`' + response.text + '`に変えてよい？', [
                            {
                                pattern: 'yes|ok|OK|いいよ|おｋ|うん|オッケー|おっけー|はい',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no|いいえ|変えない|かえない',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.say('する/しないで答えなさい');
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, '変更完了！');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'あなたの名前は ' + user.name + ' です。');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'ＯＫ！見なかったことにします。');
                        }
                    });
                }
            });
        } else {
            bot.reply(message, 'あなたのお名前は分かりません。');
        }
    });
});

/**
* 郵便検索API
* http://zipcloud.ibsnet.co.jp/doc/api
*/
controller.hears(['^郵便 (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var postCode = message.match[1];
    bot.startConversation(message, function (err, convo) {
        var http = require('http');
        http.get("http://zipcloud.ibsnet.co.jp/api/search?zipcode=" + postCode, function (result) {
            var body = '';
            result.setEncoding('utf8');
            result.on('data', function(data) {
                body += data;
            });
            result.on('end', function(data) {
                var v = JSON.parse(body);
                convo.say(v.results[0].address1
                         +v.results[0].address2
                         +v.results[0].address3
                );
                convo.next();
            });
        });
    });

});

controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

var context = '';
var mode = 'dialog';
var place = '東京';

controller.hears('', 'direct_message,direct_mention,mention', function(bot, message) {
    var apikey=process.env.zatudan_apikey;
/*
*
*
■リクエストボディ(JSON形式)
キー		必須	説明
utt		○	ユーザの発話を指定(255文字以下)
			サンプル値) こんにちは
context	-		コンテキストIDを指定(255文字以下)
			サンプル値) aaabbbccc111222333
			※会話(しりとり)を継続する場合は、レスポンスボディのcontextの値を指定する
nickname	-	ユーザのニックネームを指定(全角10文字(半角10文字)以下)
			サンプル値) 光
nickname_y	-	ユーザのニックネームの読みを指定(全角20文字以下(カタカナのみ))
			サンプル値) ヒカリ
sex		-	ユーザの性別は、下記のいずれかを指定
			男、女
bloodtype	-	ユーザの血液型は、下記のいずれかを指定
			A、B、AB、O
birthdateY	-	ユーザの誕生日(年)を指定(1～現在までのいずれかの整数(半角4文字以下))
			サンプル値) 1997
birthdateM	-	ユーザの誕生日(月)を指定(1～12までのいずれかの整数)
			サンプル値) 5
birthdateD	-	ユーザの誕生日(日)を指定(1～31までのいずれかの整数)
			サンプル値) 30
age		-	ユーザの年齢を指定(正の整数(半角3文字以下))
			サンプル値) 16
constellations	-	ユーザの星座は、下記のいずれかを指定
			牡羊座、牡牛座、双子座、蟹座、獅子座、乙女座、天秤座、蠍座、射手座、山羊座、水瓶座、魚座
place		-	ユーザの地域情報は、「場所リスト」に含まれるもののいずれかを指定
			サンプル値) 東京
mode		-	対話のモードは、下記のいずれかを指定
			dialog (省略時)
			srtr
			※会話(しりとり)を継続する場合は、レスポンスボディのmodeの値を指定する
t		-	キャラクタは、下記のいずれかを指定
			20 : 関西弁キャラ
			30 : 赤ちゃんキャラ
			指定なし : デフォルトキャラ
*
*/
    var options = {
        url: 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY='+apikey,
        json: {
            utt: message.text,
            place: place,
            sex: '女',
            bloodtype: 'O',
            age: '24',
            t: '20',

            // 以下2行はしりとり以外の会話はコメントアウトいいかも
            // 会話を継続しているかの情報
            context: context,
            mode: mode
        }
    }

    //リクエスト送信
    request.post(options, function (error, response, body) {
        context = body.context;
        mode = body.mode;

        bot.reply(message, body.utt + getRandomSmileEmoji());
    })
});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
function getRandomSmileEmoji(){
    var emojiArray = [
        '',
        ':grinning:',
        '',
        ':grimacing:',
        '',
        ':grin:',
        '',
        ':smiley:',
        '',
        ':smile:',
        '',
        ':laughing:',
        '',
        ':innocent:',
        '',
        '',
        ':wink:'
    ];
    var random = Math.floor(Math.random() * emojiArray.length);
    return emojiArray[random];
}

function isPostcode( postcode )
{
  if( (postcode.match(/^\d{3}-?\d{4}$/)) ){
    return true;
  }else{ return false; }
}
