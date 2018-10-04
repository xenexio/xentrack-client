////////////////////////////////////////////////////////////
// FORMAT
// ---------------------------------------------------------
// VER:1\n
// DEV:FFFFFFFF         hex     deviceId (fix 4)
// NAM:1234567          string  clientName (max 7)
// APS:XENEX-8FFFF      string  AP SSID (max 11)
// APP:xxxxxx           string  AP PASS (max 63)
// WS#:SSID             string  WiFi SSID (max 63)
// WP#:Pass             string  WiFi PASS (max 63)
// MS#:MqttServer       string  MQTT Server (max 63)
// MT#:MqttPort         hex     MQTT Port (fix 2)
// MU#:MqttUser         string  MQTT User (max 63)
// MP#:MqttPass         string  MQTT Pass (max 63)
// UU#:UUID             hex     UUID (fix 16)
// MC#:MacPrefix        hex     MAC Prefix (fix 3)
// DSP:Display          hex     MAC Display (fix 6)
////////////////////////////////////////////////////////////

const helper = require('../lib/helper')

module.exports = XtConfig

function XtConfig(config) {
  this.config = config || {}
  this.config.code = this.config.code || 'FFFFFFFF'
  this.lines = []
  this.configText = ''
  this._toString()
}

XtConfig.prototype._toString = function() {
  if (this.config.version) {
    this.lines.push('VER:' + this.config.version)
  }
  if (this.config.code) {
    this.lines.push('DEV:' + this.config.code)
  }
  if (this.config.name) {
    this.lines.push('NAM:' + this.config.name.substr(0, 7))
  }
  if (this.config.wifi) {
    this.config.wifi.forEach((item, i) => {
      this.lines.push(`WS${i}:${item.ssid.substr(0, 63)}`)
      this.lines.push(`WP${i}:${item.pass.substr(0, 63)}`)
    })
  }
  if (this.config.fixed) {
    this.lines.push('FIX:1')
    this.lines.push(`FIP:${this.config.fixedIp}`)
    this.lines.push(`FNM:${this.config.fixedNetmask}`)
    this.lines.push(`FGW:${this.config.fixedGateway}`)
  } else {
    this.lines.push('FIX:0')
  }
  if (this.config.mqtt) {
    this.config.mqtt.forEach((item, i) => {
      this.lines.push(`MS${i}:${item.server.substr(0, 63)}`)
      this.lines.push(`MT${i}:${helper.numToHex(item.port, 4)}`)
      this.lines.push(`MU${i}:${item.user.substr(0, 63)}`)
      this.lines.push(`MP${i}:${item.pass.substr(0, 63)}`)
    })
  }
  if (this.config.uuid) {
    this.config.uuid.forEach((item, i) => {
      this.lines.push(`UU${i}:${item}`)
    })
  }
  if (this.config.macPrefix) {
    this.config.macPrefix.forEach((item, i) => {
      this.lines.push(`MA${i}:${item}`)
    })
  }
  if (this.config.macDisplay) {
    this.lines.push('DSP:' + this.config.macDisplay)
  }
  return this.lines.join('\n')
}

XtConfig.prototype.genPage = function(limit = 110) {
  let s = ''
  let len = 0
  let pages = []
  let pageIdx = 0
  if (this.lines.length === 0) {
    return []
  }
  this.lines.forEach(line => {
    if (pageIdx >= pages.length) {
      pages.push('')
    }
    if (pages[pageIdx].length + line.length > limit) {
      pageIdx++
      pages[pageIdx] = line + '\n'
    } else {
      pages[pageIdx] += line + '\n'
    }
  })
  return pages
}
