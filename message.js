
//123
module.exports = {
    testmessage:  {
        type: 'image',
        originalContentUrl: 'https://i1.kknews.cc/SIG=2ru26a9/ctp-vzntr/15301131549198023s8q5n0.jpg',
        previewImageUrl: 'https://i1.kknews.cc/SIG=2ru26a9/ctp-vzntr/15301131549198023s8q5n0.jpg'
    },
    QuickMessageAir:{
        "type": "text", // ①
        "text": "選擇你想要查詢的縣市",
        "quickReply": { // ②
            "items": [
            {
                "type": "action", // ③
                "imageUrl": "https://example.com/sushi.png",
                "action": {
                "type": "message",
                "label": "苗栗縣",
                "text": "/空氣苗栗縣"
                }
            },
            {
                "type": "action",
                "imageUrl": "https://example.com/tempura.png",
                "action": {
                "type": "message",
                "label": "新北市",
                "text": "/空氣新北市"
                }
            },
            {
                "type": "action", // ④
                "action": {
                "type": "message",
                "label": "屏東縣",
                "text": "/空氣屏東縣"
                }
            },
            {
                "type": "action", // ④
                "action": {
                "type": "message",
                "label": "高雄市",
                "text": "/空氣高雄市"
                }
            },
            {
                "type": "action", // ④
                "action": {
                "type": "message",
                "label": "新竹市",
                "text": "/空氣新竹市"
                }
                
            },
            ]
        }
    },
}