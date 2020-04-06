export default function replaceNull(someObj, replaceValue = "***") {
    const replacer = (key, value) =>
        String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
    //^ because you seem to want to replace (strings) "null" or "undefined" too

    return JSON.parse( JSON.stringify(someObj, replacer));
}
