function parseHexString(hexString: string): number[] {
    var result = [];
    while (hexString.length >= 1) {
        result.push(parseInt(hexString.substring(0, 2), 16));
        hexString = hexString.substring(2, hexString.length);
    }
    return result;
}