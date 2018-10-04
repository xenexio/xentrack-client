module.exports = {
  numToHex,
}

function numToHex(n, d = 2) {
  return n.toString(16).toUpperCase().padStart(d, '0')
}
