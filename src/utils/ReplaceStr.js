export const replaceNoENtoTH = (str) => {
    str = str.toString();
    var find_full = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    var replace_full = ["๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙", "๐"];

    for (var i = 0; i < find_full.length; i++) {
        str = str.replace(new RegExp(find_full[i], 'gi'), find_full[i]);
    }
    return str;
}