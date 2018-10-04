module.exports = {
  mqtt: {
    server: process.env.MQTT_SERVER || 'mqtt://mqtt-server:1883',
    user: process.env.MQTT_USER || '',
    pass: process.env.MQTT_PASS || '',
  },
}
