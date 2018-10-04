const mqtt = require('mqtt')
const http = require('http')

const XtData = require('./model/xt-data')

const config = require('./config')

const client = mqtt.connect(config.mqtt.server, {
  username: config.mqtt.user,
  password: config.mqtt.pass,
})


client.on('connect', () => {
  console.log('mqtt connected')
  client.subscribe('xt-d') // for data
  client.subscribe('xt-p') // for ping
})

client.on('message', (topic, message) => {
  let msg = message.toString()
  if (topic === 'xt-d') {
    processXentrackData(msg)
  } else if (topic === 'xt-p') {
    processXentrackPing(msg)
  }
})

function processXentrackPing(msg) {
  let deviceId = msg.substr(0, 8)
  let firmware = msg.substr(8, 4)
  console.log('GOT PING', deviceId, firmware)
  // TODO: process ping
}
  
function processXentrackData(msg) {
  let data = XtData.fromString(msg)
  console.log('GOT DATA', data)
  // TODO: process data
  // { version: 1,
  //   code: '00200005',
  //   list:
  //    [ { type: 'temp',
  //        mac: 'AC233FA052B2',
  //        batt: 100,
  //        temp: -22.56,
  //        humi: 69.5 },
  //      { type: 'beacon',
  //        uuid: 'E2C56DB5DFFB48D2B060D0F5A71096E0',
  //        major: 0,
  //        minor: 0,
  //        rssi: -71 },
  //    ],
  // }
}
