module.exports = {
    MorningBobule: {
        "type": "flex",
        "altText": "this is a flex message",
            "contents": { 
            "type": "bubble",
            "body": {
            "type": "box",
            "layout": "vertical",
            "background": {
                "type": "linearGradient",
                "angle": "90deg",
                "startColor": "#FFFF00",
                "endColor": "#0080ff"
            },    
                "contents": [
                    {
                    "type": "text",
                    "text": "今天我是你的小幫手~ 請多多指教..",
                    "color": "#0000ff"
                    },
                    {
                    "type": "text",
                    "text": "早安唷! ",
                    "color": "#AF45F5"
                    },
                    {
                    "type": "text",
                    "text": "祝你有個愉快的一天",
                    "color": "#AF45F5"
                    }
                    
                ]
            }
        }
    },
    sticker: {
        type: 'sticker',
        packageId: "11538",
        stickerId: "51626494"
    }
}