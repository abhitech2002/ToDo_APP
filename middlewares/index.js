// Logs of the todo
function logger(req, res, next){
    console.log("New Request: ", new Date().toLocaleString(), ", Method: ", req.method, ", URL: " + req.url)
    req.randomKey = "This is random key"
    next()
}

// Authetication for Login
function isAuthenticated(req, res, next) {
// console.log("---auth--- ",  req.headers.authorization )
    if(!req.headers.authorization || req.headers.authorization === "null"  ) {
        return res.status(200)
        .json({ 
            redirect: true
        })
    }
    next()
}

// Exporting modules
module.exports = {
    logger,
    isAuthenticated
}