const mqtt = require('mqtt')

const XtConfig = require('./model/xt-config')
const helper = require('./lib/helper')

const config = require('./config')

const client = mqtt.connect(config.mqtt.server, {
  username: config.mqtt.user,
  password: config.mqtt.pass,
})

let $scope = {
  config: {},
}

////////////////////////////////////////////////////////////
// UPDATE CONFIG HERE
////////////////////////////////////////////////////////////
const code = 'FFFF' + 'FFFF'
const newCode = 'FFFF' + 'FFFF'
const cfg = {
  name: 'DEMOKIT', // max length = 7
  code: newCode,
  wifi: [ // max 8 APs
    { ssid: 'xenex-ap', pass: '6626754555' }, // max len = 63
  ],
  mqtt: [ // max 8 servers
    { server: 'mqtt-server', port: 1883, user: 'xt-rec', pass: 'xt!4555' }, // max len = 63
  ],
}

client.on('connect', function () {
  console.log('mqtt connected')
  client.subscribe('xt-ca') // subscribe for ack
  xtConfig = new XtConfig(cfg)
  let pages = xtConfig.genPage(100)
  $scope.config[code] = pages.map((page, i) => helper.numToHex(i + 1, 1) + helper.numToHex(pages.length, 1) + page)
  client.publish('xt-c-' + code, $scope.config[code][0])
})

client.on('message', function (topic, message) {
  if (topic === 'xt-ca') {
    console.log('GOT ACK:', topic, message.toString())
    let msg = message.toString()
    let code = msg.substr(0, 8)
    let page = parseInt(msg.substr(8,1))
    if (!$scope.config[code]) {
      console.log('CONFIG NOT FOUND', code, page)
      return
    }
    if (page < $scope.config[code].length) {
      page++
      client.publish('xt-c-' + code, $scope.config[code][page-1])
    } else {
      console.log('PUSH CONFIG DONE')
      process.exit(0)
    }
  }
})
