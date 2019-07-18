//For maintaining consistency in generating response
let generate = (isError , status, errMessage, data) => {
    let response = {
        isError : isError,
        status : status,
        errMessage : errMessage,
        data : data
    };
    return response;
}

//Exporting modules
module.exports = {
    generate : generate
}