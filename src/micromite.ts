const parseMicromite = (bytes: number[]) => {
    let lat = ((bytes[0] << 16) | (bytes[1] << 8) | (bytes[2]));
    let lon = ((bytes[3] << 16) | (bytes[4] << 8) | (bytes[5]));

    if (lat != 0 && lon != 0) {
        if ((lat & 1 << 23) != 0) {
            lat = -(1 << 24) + lat;
        }

        lat /= 1 << 23;
        lat *= 90;

        if ((lon & 1 << 23) != 0) {
            lon = -(1 << 24) + lon;
        }

        lon /= 1 << 23;
        lon *= 180;
    }

    lat = 42.356848;
    lon = 14.138848;

    return {
        latitude: lat.toFixed(7),
        longitude: lon.toFixed(7)
    };
};