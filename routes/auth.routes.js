const express = require("express")
const { body, validationResult } = require("express-validator") // for authorization 
const JWT = require("jsonwebtoken")
const { SECRET } = require("../config")
const router = express.Router()
const fs = require("fs/promises")
const { readUser } = require("../utils/utils")
const bcrypt = require("bcryptjs") // TO hash the password
const { hash } = require("bcrypt")
const { error } = require("console")

// replacing USER array with users.json
// const USER = []

// Register 
router.post("/register",
    body("name")
        .custom((name) => {
            if (typeof name === "string" && name.length >= 5) {
                return true
            }
            return false
        })
        .withMessage("Name should be of minimum 5 characters."),
    body("email")
    .isEmail()  // inbuild function for email
        .withMessage("Enter email in proper format."),
    body("password")
        .custom((password) => {
            if (typeof password === "string" && password.length >= 8) {
                return true
            }
            return false
        })
        .withMessage("Password should be of minimum 8 characters."),
        async(req, res) => {

            const { name, email, password } = req.body
            // const userData = req.body

            const errors = validationResult(req) // Using express validator

            if (!errors.isEmpty()) {
                return res.status(400)
                    .json({
                        message: "User registeration failed.",
                        error: errors.array(),
                        data: {}
                    })
            }
            try {
                // Check if password is valid
                if (typeof password !== "string") {
                    return res
                    .status(400)
                    .json({
                    message: "User registration failed.",
                    error: "Invalid password format.",
                    data: {},
                    });
                }
                    // Hash the password
                    const hashPassword = await bcrypt.hash(req.body.password, 10); // To genrate a  hash    

                    const userData = await readUser()

                    const existingUser = userData.find((user) => user.email ===email)
                    if(existingUser){
                        return res.status(400)
                        .json({
                            message:"User registration failed.",
                            error: "User already exist",
                            data : {}
                        })
                    }

                    const newUser = {
                        name, 
                        email, 
                        password: hashPassword   // To store the hashed password 
                    }
                   
                    // req.session.user = newUser
                        readUser()
                        .then((data)=> {
                            data.push(newUser)
                            // writing the updated data to the users array to the files
                            return fs.writeFile("users.json", JSON.stringify(data))
                        })
                        return res.status(201).json({
                            message: "User registeration successful.",
                            error: null,
                            data: {}
                        })
                }
                catch(error){
                    console.log("Error in User registeration", error)
                    return res.status(500).json({
                        message: "User registeration failes",
                        error: "server failed",
                        data: {}
                    })
                }

            }
            // Due to users.json USER.push now uncessary
            // USER.push(
            //     {
            //         name,
            //         email,
            //         password
            //     }
            // )   
)   

// Login 
router.post("/login", async(req, res) => {
    const { email, password } = req.body 

    console.log("---user info ---", email, password)
    try{
        const user_data = await readUser() // REad user data from users,json

        // finding users by email
        const user = user_data.find((user)=>user.email === email)

        if (!user && user_data.length <=0 ) {
            return res.status(400)
                    .json({
                        message: "User login failed.",
                        error: "User does not exists.",
                        data: {}
                    })
        } 
    
        
        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch) {
            return res.status(404)
                    .json({
                        message: "User login failed.",
                        error: "Invalid Password",
                        data: {}
                    })
        }

        req.session.isLoggedIN = true
        req.session.user =user
        // create access tokens response to clientjwt npm

        const token = JWT.sign({ email }, SECRET)
        
        return res.status(200)
        .json({
            message: "User login successful.",
                error: null,
                data: {
                    access_token: token
                }
        })
        

    }
    catch(error){
        console.error("Error in login:", error)
        return res.status(500).json({
            message: "Internal server error.",
            error: "Failed to log in user.",
            data: {},
          });
    }
})
module.exports = router