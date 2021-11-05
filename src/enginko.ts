/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * payload      -> payload substring of measurement
 * 
 * OUTPUT:
 * date         -> date of measurement. See @parseDate
 * temperature  -> temperature in �C. See @getTemperature
 * humidity     -> percentage of humidity. See @getHumidity
 * pressure     -> pressure in Pa. See @getPressure
 * lux          -> illuminance in lx
 * voc          -> air quality in IAQ / ppb
 * co2          -> CO2 concentration in ppm
 */


function parseCo2Measurement(payload: string) {
  return {
    date: parseDate(payload.substring(0, 8)),
    temperature: getTemperature(parseInt(payload.substring(8, 10), 16), parseInt(payload.substring(10, 12), 16)),
    humidity: getHumidity(parseInt(payload.substring(12, 14), 16)),
    pressure: getPressure(parseInt(payload.substring(14, 16), 16), parseInt(payload.substring(16, 18), 16), parseInt(payload.substring(18, 20), 16)),
    lux: Number(parseUnsignedShort(payload.substring(20, 24))),
    voc: Number(parseUnsignedShort(payload.substring(24, 28))),
    co2: Number(parseSignedShort(payload.substring(28, 32)))
  }
}

/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * lo       -> payload substring for humidity byte
 * 
 * OUTPUT:
 * humidity -> percentage of humidity 
 */


function getHumidity(lo: number) {
  var humidity = (((0 & 0xFF) << 8 | lo & 0xFF) << 16 >> 16) / 2;
  return Number(humidity);
}
/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * lo       -> payload substring of first pressure byte
 * mi       -> payload substring of second pressure byte
 * hi       -> payload substring of third pressure byte
 * 
 * OUTPUT:
 * pressure -> pressure in Pa
 */


function getPressure(lo: number, mi: number, hi: number) {
  var pressure = String((lo & 0xFF) + (mi << 8 & 0xFF00) + (hi << 16 & 0xFF0000)).padStart(3);
  pressure = pressure.substring(0, pressure.length - 2) + "." + pressure.substring(pressure.length - 2);
  return Number(pressure);
}
/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * lo           -> payload substring of first temperature byte
 * hi           -> payload substring of second temperature byte
 * 
 * OUTPUT:
 * temperature  -> temperature in �C
 */


function getTemperature(lo: number, hi: number) {
  var temperature = String((lo & 0xFF) + (hi << 8 & 0xFF00) << 16 >> 16).padStart(3);
  temperature = temperature.substring(0, temperature.length - 2) + "." + temperature.substring(temperature.length - 2);
  return Number(temperature);
}
/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * bytes    -> string of bytes to parse 
 * 
 * OUTPUT:
 * n        -> parsed number
 */


function parseUnsignedShort(bytes: string) {
  bytes = reverseBytes(bytes);
  var rno = hexStringToByteArray(bytes);
  var n = 0;

  if (rno.length === 2) {
    n = rno[0] << 8 & 0x0000FF00 | rno[1] << 0 & 0x000000FF;
  }

  return n;
}
/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * bytes    -> string of bytes to parse 
 * 
 * OUTPUT:
 * n        -> parsed number
 */


function parseSignedShort(bytes: string) {
  bytes = reverseBytes(bytes);
  var rno = hexStringToByteArray(bytes);
  var n = 0;

  if (rno.length === 2) {
    var n = (rno[0] << 8 | rno[1]) << 16 >> 16;
  }

  return n;
}
/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * s        -> string to convert in bytes array
 * 
 * OUTPUT:
 * bytes    -> bytes array hex to dec
 */


function hexStringToByteArray(s: string) {
  for (var bytes = [], c = 0; c < s.length; c += 2) {
    bytes.push(parseInt(s.substr(c, 2), 16));
  }

  return bytes;
}

/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * bytes    -> string of bytes to invert for LSB
 * 
 * OUTPUT:
 * reversed -> reversed string of bytes in LSB
 */
function reverseBytes(bytes: string) {
  var reversed = bytes;

  if (bytes.length % 2 === 0) {
    reversed = "";

    for (var starting = 0; starting + 2 <= bytes.length; starting += 2) {
      reversed = bytes.substring(starting, starting + 2) + reversed;
    }
  }

  return reversed;
}

/*
 * VERSION: 1.0.0
 * 
 * INPUT:
 * payload  -> payload substring to decode
 * 
 * OUTPUT:
 * date     -> date decoded from payload
 */
function parseDate(payload: string) {
  var date = new Date();
  var binary = Number(parseInt(reverseBytes(payload), 16)).toString(2).padStart(32, '0');
  var year = parseInt(binary.substring(0, 7), 2) + 2000;
  var month = parseInt(binary.substring(7, 11), 2);
  var day = parseInt(binary.substring(11, 16), 2);
  var hour = parseInt(binary.substring(16, 21), 2);
  var minute = parseInt(binary.substring(21, 27), 2);
  var second = parseInt(binary.substring(27, 32), 2) * 2;
  return new Date(year, month - 1, day, hour, minute, second, 0);
}

export function parseEnginko(fport: number, payload: string) {
  if(payload.length > 0) {
    var uplinkId = payload.substring(0, 2);

    switch(uplinkId.toUpperCase()) {
      case '0E': // T/P/RH/LUX/VOC/CO2
        return {
          m1: parseCo2Measurement(payload.substring(2, 34)),
          m2: parseCo2Measurement(payload.substring(34, 66)),
          battery: Number(parseInt(payload.substring(66, 68), 16))
        }
    }
  }
}