const fs = require("fs/promises")

// helps to read file
function readData() {
    return fs.readFile("db.json", "utf8")
    .then((data) => {
        return JSON.parse(data.toString())
    })
}

// For store information in JSON Format

function readUser(){
    return fs
    .readFile("users.json", "utf8")
    .then((data) => {
        if(data){
            return JSON.parse(data.toString())
        }else{
            return []
        }
        
    })
}

module.exports = {
    readData,
    readUser
}