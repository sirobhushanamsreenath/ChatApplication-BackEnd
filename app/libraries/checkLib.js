let isEmpty = (value) => {
    if(value === undefined || value === null || value === '' || trim(value) === '' || value.length == 0){
        return true;
    } else {
        return false;
    }
}

let trim = (x) => {
    let value = String(x);
    return value.replace(/^\s+|\s+$/gm, '');
}

//exporting module
module.exports = {
    isEmpty : isEmpty
}