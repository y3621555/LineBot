// 引用linebot SDK
var linebot = require('linebot');
var request = require('request');
var cheerio = require("cheerio");
var MSG = require("./message");
var MORNING = require("./Morning");

// 填入辨識Line Channel的資訊
var bot = linebot({ 
    channelId: '1655574641', 
    channelSecret: '262ea6c06b01a63084fd387c9cadd474', 
    channelAccessToken: 'QWd4uqTJOvzwLsLxrn53Kx3PbrSwbY98B8y25Z9bP+aHECxifROsYK3lFXNgHm3C+pJxqyou0PHyx7TcVfvK5nEoWc/yMyJGERx/aTBC1I6A9rhcJfNFbSUuJiJ6ZEywcmkKouQvuZknppGtNX4CDgdB04t89/1O/w1cDnyilFU='
});
var userId = 'Ufef5fd047128706847796a1512a50dcc';
var groupId = 'Ceaf323ea4f08c75e795ddadfbd9eb800';
//var USD;
//var JPY;

const SITE_NAME = '苗栗';
const opts = {
    uri: "http://opendata2.epa.gov.tw/AQI.json",
    json: true
};

function ChangeToChinese (data){
    //var userId = 'Ufef5fd047128706847796a1512a50dcc';

    data = data.replace(/,/g, "\n");
    data = data.replace(/[{}]/g , "").replace("SiteName" , "監測站").replace("County" , "城市");
    data = data.replace("AQI" , "空氣品質指標");
    data = data.replace("Pollutant" , "空氣汙染指標物")
    data = data.replace("Status" , "狀態")
    data = data.replace("SO2" , "二氧化硫濃度")
    data = data.replace("CO" , "一氧化碳濃度")
    data = data.replace("CO_8hr" , "一氧化碳8小時移動平均")
    data = data.replace("O3" , "臭氧濃度")
    data = data.replace("O3_8hr" , "臭氧8小時移動平均")
    data = data.replace("PM10" , "PM10懸浮微粒")
    data = data.replace("PM2.5" , "PM2.5懸浮微粒")
    data = data.replace("NO2" , "二氧化氮濃度")
    data = data.replace("NOx" , "氮氧化物濃度")
    data = data.replace("NO" , "一氧化氮濃度")
    data = data.replace("WindSpeed" , "風速")
    data = data.replace("WindDirec" , "風向")
    data = data.replace("PublishTime" , "發布時間")
    data = data.replace("PM2.5_AVG" , "PM2.5懸浮微粒移動平均")
    data = data.replace("PM10_AVG" , "PM10懸浮微粒移動平均")
    data = data.replace("SO2_AVG" , "二氧化硫移動平均")
    data = data.replace("Longitude" , "經度")
    data = data.replace("Latitude" , "緯度")
    data = data.replace("SiteId" , "測站代碼")
    //console.log(data);

    bot.push(userId,[data]);
}


var date_ob = new Date();
var hour = date_ob.getHours();
var min = date_ob.getMinutes();

var jp = function() {
    request({
      url: "https://rate.bot.com.tw/xrt?Lang=zh-TW",
      method: "GET"
    }, function(error, response, body) {
      if (error || !body) {
        return;
      }else{
  
      // 爬完網頁後要做的事情
      var $ = cheerio.load(body);
      var target = $(".rate-content-cash.text-right.print_hide");
      var time = $(".time");

      var TIME = time[0].children[0].data;
      var USD = target[0].children[0].data;
      var JPY = target[14].children[0].data;
      
      bot.push(userId,`牌價最新掛牌時間: ${TIME} \n日圓買入匯率: ${JPY} \n美元買入匯率: ${USD}`);
      }
    });
  };
var count =0;

function MorningTimeRun() {
    var date_ob = new Date();
    var hour = date_ob.getHours();
    var min = date_ob.getMinutes();
    //console.log(hour + `.` + min );


    //早上打招呼 hour == 22 && min == 38 
    if ( hour == 18 && min == 50&& count == 0  ){
        //var userId = 'Ufef5fd047128706847796a1512a50dcc';
        var sendMsg = `早安! 有愉快的一天`;

        bot.push(userId, [MORNING.MorningBobule]);
        bot.push(userId, [MORNING.sticker]);

        //Get Localtion
        request(opts, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let data;
                
                for (i in body) {
                    console.log(body[i]);
                    if (body[i].SiteName == SITE_NAME) {
                        data = body[i];
                        break;
                    }
                }
                var air_data = JSON.stringify(data);
                ChangeToChinese(air_data);
            }
        });

        jp();

        count +=1;
    }
    else if ( min != 50  ){
        count = 0;
    }
    //console.log( count );

  }
  
  setInterval(MorningTimeRun, 10000);

var prefix = "/";
// 當有人傳送訊息給Bot時
bot.on('message', function (event) { // event.message.text是使用者傳給bot的訊息 
    // 準備要回傳的內容 
    var Msg = event.message.text;
    var MSG_PREFIX = Msg.substring(0,1);
    if ( MSG_PREFIX == prefix){
        if ( Msg.substring(1,3) == "空氣"){
            if (Msg.substring(3,6).length == 0 ){
                event.reply([MSG.QuickMessageAir]).then(function (data) { 
                    // 當訊息成功回傳後的處理 
                }).catch(function (error) { 
                    // 當訊息回傳失敗後的處理
                });
            }
            else {
                request(opts, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        let data;
                        var boolean;
                        
                        for (i in body) {
                            //console.log(body[i]);
                            if (body[i].County == Msg.substring(3,6)) {
                                console.log("ok!!!")
                                data = body[i];
                                boolean = 1;
                                break;
                            }
                            else {
                                console.log("Nok!!!")
                                boolean = 0;
                            }
                        }
                        if ( Boolean(boolean) ){
                            var air_data = JSON.stringify(data);

                            air_data = air_data.replace(/,/g, "\n");
                            air_data = air_data.replace(/[{}]/g , "").replace("SiteName" , "監測站").replace("County" , "城市");
                            air_data = air_data.replace("AQI" , "空氣品質指標");
                            air_data = air_data.replace("Pollutant" , "空氣汙染指標物")
                            air_data = air_data.replace("Status" , "狀態")
                            air_data = air_data.replace("SO2" , "二氧化硫濃度")
                            air_data = air_data.replace("CO" , "一氧化碳濃度")
                            air_data = air_data.replace("CO_8hr" , "一氧化碳8小時移動平均")
                            air_data = air_data.replace("O3" , "臭氧濃度")
                            air_data = air_data.replace("O3_8hr" , "臭氧8小時移動平均")
                            air_data = air_data.replace("PM10" , "PM10懸浮微粒")
                            air_data = air_data.replace("PM2.5" , "PM2.5懸浮微粒")
                            air_data = air_data.replace("NO2" , "二氧化氮濃度")
                            air_data = air_data.replace("NOx" , "氮氧化物濃度")
                            air_data = air_data.replace("NO" , "一氧化氮濃度")
                            air_data = air_data.replace("WindSpeed" , "風速")
                            air_data = air_data.replace("WindDirec" , "風向")
                            air_data = air_data.replace("PublishTime" , "發布時間")
                            air_data = air_data.replace("PM2.5_AVG" , "PM2.5懸浮微粒移動平均")
                            air_data = air_data.replace("PM10_AVG" , "PM10懸浮微粒移動平均")
                            air_data = air_data.replace("SO2_AVG" , "二氧化硫移動平均")
                            air_data = air_data.replace("Longitude" , "經度")
                            air_data = air_data.replace("Latitude" , "緯度")
                            air_data = air_data.replace("SiteId" , "測站代碼")
                            event.reply(air_data).then(function (data) { 
                                // 當訊息成功回傳後的處理 
                            }).catch(function (error) { 
                                // 當訊息回傳失敗後的處理
                            });
                        }
                        else {
                            event.reply(`查無資料`).then(function (data) { 
                                // 當訊息成功回傳後的處理 
                            }).catch(function (error) { 
                                // 當訊息回傳失敗後的處理
                            });
                        }
        
                    }
                });
            }

        }
        else if (Msg.substring(1,3) == "測試" ){
            console.log("測試")
            event.reply(
                [MSG.testmessage]
            ).then(function (data) { 
                // 當訊息成功回傳後的處理 
            }).catch(function (error) { 
                console.log(`發送失敗`)
                // 當訊息回傳失敗後的處理
            });

        }
        else if (Msg.substring(1,5) == "coin"){
            request({
                url: "https://rate.bot.com.tw/xrt?Lang=zh-TW",
                method: "GET"
              }, function(error, response, body) {
                if (error || !body) {
                  return;
                }else{
            
                // 爬完網頁後要做的事情
                var $ = cheerio.load(body);
                var target = $(".rate-content-cash.text-right.print_hide");
                var time = $(".time");
                //console.log(time[0].children[0].data);
                //console.log(target[14].children[0].data);
                //console.log(target[0].children[0].data);
                var TIME = time[0].children[0].data;
                var USD = target[0].children[0].data;
                var JPY = target[14].children[0].data;
                
                //bot.push(userId,`牌價最新掛牌時間: ${TIME} \n日圓買入匯率: ${JPY} \n美元買入匯率: ${USD}`);
                event.reply(`牌價最新掛牌時間: ${TIME} \n日圓買入匯率: ${JPY} \n美元買入匯率: ${USD}`).then(function (data) { 
                    // 當訊息成功回傳後的處理 
                }).catch(function (error) { 
                    // 當訊息回傳失敗後的處理
                });
                }
              });
        }
        else {
            event.reply("指令").then(function (data) { 
                // 當訊息成功回傳後的處理 
            }).catch(function (error) { 
                // 當訊息回傳失敗後的處理
            });

        }
    }
    else {
        var replyMsg = `Hello你剛才說的是:${event.message.text}`; 
        if (event.message.text == "520"){
            jp()
            console.log(event.source.groupId);
            event.reply("我也愛你").then(function (data) { 
                // 當訊息成功回傳後的處理 
            }).catch(function (error) { 
                // 當訊息回傳失敗後的處理
            });
        }
        else{
                // 透過event.reply(要回傳的訊息)方法將訊息回傳給使用者 
            event.reply(replyMsg).then(function (data) { 
                // 當訊息成功回傳後的處理 
            }).catch(function (error) { 
                // 當訊息回傳失敗後的處理
            });
        }
    }
});



// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', 3000, function () { 
    console.log('[BOT已準備就緒]'
    );
});

