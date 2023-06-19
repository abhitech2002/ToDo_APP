1. server created and run on port 3000
2. GET /greetings call --> "Hello World" of server
3. GET /todos call -->
    * readData --> readFile --> data(string) --> Array Object(JSON.parse)
    * response object --> "message", "data" and "error"
4. POST /todos call -->
    * middleware -->
    * readData
    * newTodo
    * fs.writeFile --> "final data" --> stringify(array object) --> object


# EJS

basic syntax = <% some code %>
variable & value = <%= varName %>
string in sntax - <% "some value" %>
import syntax - <%- include("path/to/file") %>


# authentication

Register => user_info => save in database

Register => user_info => password (hash & salt ) => hash is saved in db

Login => incoming_info compare with save_info => yes login allowed
=> no login failed

login => incoming_info => password (plain text) => compare (with salt) and hash saved in db => yes or no

