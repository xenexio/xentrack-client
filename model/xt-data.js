module.exports = {
  fromString,
}

const macPrefix = [
  'AC233F',
]

const uuidLookup = [
  '6E732E636F2E74682D69626561636F6E',
  'EBEFD08370A247C89837E7B5634DF524',
  'E2C56DB5DFFB48D2B060D0F5A71096E0',
  'FDA50693A4E24FB1AFCFC6EB07647825',
  '74278BDAB64445208F0C720EAF059935',
  '54686169426561636F6E4E6970706F6E',
]

function fromString(raw) {
  let data = Buffer(raw, 'base64')
  if (data.length < 5) {
    return null
  }
  let version = data[0]
  let code = numToHex(data[1]) + numToHex(data[2]) + numToHex(data[3]) + numToHex(data[4])
  let list = []
  let pos = 5
  while (pos < data.length) {
    let type = (data[pos] >> 4) & 0xff
    if (type === 0 && pos + 5 < data.length) {
      let idx = data[pos] & 0x0f
      let uuid = uuidLookup[idx] || ''
      let major = data.readInt16BE(pos + 1)
      let minor = data.readInt16BE(pos + 3)
      let rssi = -data[pos + 5]
      list.push({
        type: 'beacon',
        uuid,
        major,
        minor,
        rssi,
      })
      pos += 6
    } else if (type === 1) {
      let idx = data[pos] & 0x0f
      let mac = (macPrefix[idx] && macPrefix[idx] + numToHex(data[pos + 1], 2) + numToHex(data[pos + 2], 2) + numToHex(data[pos + 3], 2)) || ''
      list.push({
        type: 'temp',
        mac,
        batt: data[pos + 4],
        temp: data.readInt16BE(pos + 5) / 100,
        humi: data.readInt16BE(pos + 7) / 100,
      })
      pos += 9
    } else {
      // unknown type
      console.log('unknown type', type)
      break
    }
  }
  return {
    version,
    code,
    list,
  }
}

function numToHex(n, d = 2) {
  return n.toString(16).toUpperCase().padStart(d, '0')
}
