//Description: The server for Shafkat Photo Gallery
//Shafkat Anowar & Justin Tokuda 12/3/2019-Code was learned from Lab 13,14, Jayla Kaita's assignment and through Mr. Kazman's Help
const querystring = require('querystring'); //Cannot change anything within the querystring

var express = require('express'); //initializes express to set up web server
var myParser = require("body-parser"); //initializes body-parser to set up web server
var products = require("./public/product_data.js"); //uses products listed in the product_data.js file
var filename = 'user_data.json' //Defines the user_data.json array as an object
var app = express(); //Executes Express
var qs = require('querystring'); //Needs querystring in order to initiate functions
var qstr =  {}; //Defines qstr as a variable containing information to be passed to login page
var photoquant = {}; //Defines photoquant as a variable that requests the query string





app.use(myParser.urlencoded({ extended: true }));
//intercept purchase submission form, if good give an invoice, otherwise send back to order page
app.get("/process_page", function (request, response) {
   //look up request.query
   photoquant = request.query;
   params = request.query;
   console.log(params);
   if (typeof params['purchase_submit'] != 'undefined') {  //check if quantity data is valid
      has_errors = false; // assume quantities are valid from the start
      total_qty = 0; // need to check if something was selected so we will look if the total > 0
      for (i = 0; i < products.length; i++) {
         if (typeof params[`quantity${i}`] != 'undefined') {
            a_qty = params[`quantity${i}`]; //makes textboxes sticky in case of invalid data
            total_qty += a_qty; //Adds up all quantities
            if (!isNonNegInt(a_qty)) {
               has_errors = true; // Invalid quantity
            }
         }
      }
        // Now respond to errors or redirect to invoice if all is ok
      qstr = querystring.stringify(request.query);
      //if quantity data is not valid, send them back to product display
      if (has_errors || total_qty == 0) { 
         qstr = querystring.stringify(request.query);
         response.redirect("products_store.html?" + qstr);
      } else { // if quantity data is valid, send them to the invoice
         response.redirect("login.html?" + qstr);
      }
   }
});
//if quantity data valid, send them to the login page

//Ensures data inputted isn not a negative number, does not contain letters and is not a decimal
function isNonNegInt(q, returnErrors = false) {
   errors = []; // assume no errors at first
   if (q == "") { q = 0; } //handle blank inputs as if they are 0
   if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
   if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
   if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
   return returnErrors ? errors : (errors.length == 0); //returns as error
}



fs = require('fs'); //Use the file system module 

//returns a boolean (true or false) (Opens file only if it exists)
if (fs.existsSync(filename)) {
   stats=fs.statSync(filename) //gets the stats of your file
  

data=fs.readFileSync(filename, 'utf-8'); //Reads the file and returns back with data and then continues with code as requested.
users_reg_data = JSON.parse(data); //Parses data in order to turn string into an object
}



//GETS TO LOGIN PAGE
app.get("/login.html", function (request, response) {
   // Give a simple login form (responds by going to the login page) and requests information inputted by this form 
   str = `
   <html lang="en">
   <link href="products_style.css" rel="stylesheet">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Document</title>
</head>
<h1>Shafkat's Photo Gallery Login</h1>
<h2>To continue purchasing, please login below!</h2>
<body>
<form action="" method="POST"> 
   <div>
   <input type="text" name="username" size="40" placeholder="enter username" ><br /> 
   <input type="password" name="password" size="40" placeholder="enter password"><br />
   <input type="submit" value="Submit" id="submit">  </div>
   </form>  
</body>
<h2>Are you a new user? Please click below to register for products!</h2>
<body>
<div>
<form action="./registration.html">
<input type="submit" value="Register Here" id="register_here" name="register_here">
</form>
</div>
</body>
</html>
   `;
   response.send(str);
});


  // Process login form POST and redirect to invoice page if ok and back to login page if not
app.post("/login.html", function (request, response) {
    console.log(photoquant);
    the_username= request.body.username.toLowerCase(); //makes username case insensitive
    //Validate login data
    if(typeof users_reg_data[the_username] != 'undefined'){   //To check if the username exists in the json data
      if( users_reg_data[the_username].password ==request.body.password){
               theQuantQuerystring = qs.stringify(photoquant); //make the query string of prod quant needed for invoice
               response.redirect('/purchase.html?' + theQuantQuerystring + `&username=${the_username}`); //Adds username & quantity to invoice
      }
       else {
          response.send('Invalid Login: Please hit the back button and try again'); //if password isn't equal to password existing in jsonn data, show error message
       
      }
      
  }
  if (response.send('Invalid Login: Please hit the back button and try again ')){
   
   }
});

app.get("/registration.html", function (request, response) {
   // Give a simple registration form (responds by sending to the registration html page) and requests information inputted by this form 
   str = `
   <html lang="en">
   <link href="pretty.css" rel="stylesheet">
 <script>src="server.js"</script>
 <head>
   <h1>Shafkat's Photo Gallery Registration</h1>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="ie=edge">
 <title>Document</title>
 </head>
 <body>
 
 <script>
   //checks if password is equal to repeat password on html form, if not, then show error message that says passwords don't match, please retype
 function checkpassword() 
 {var p=f.password.value;
 var cp=f.repeat_password.value;
 if(p==cp) {}
 else
 alert("Passwords Don't Match. Please retype")
 response.redirect("registration.html?"); //If passwords don't match, redirect back to registration html page
 }
 </script>
 <script>
 //Below contains the registration validations and guards that prevent error data from being inputted and meet the assignment's requirments
 //Full Username: Only allows letters and 30 characters max
 //Username: Has minimum of 4 characters, maximum 10, letters and numbers are only valid, case insensitive
 //Email: x@y.z format and address contains only numbers, letters and _. in the beginning. The host machine can only contain numbers and letters and the domain name is 2 or 3 letters and case insensitive
 //Password: Is a minimum of 6 characters, any characters are valid (Same requirements is applied to repeat password) 
 </script>
 <body>
 <div>
 <form  name ="f" method="POST" action="" onsubmit=validatePassword() >
 <input type="text" name="fullname" size="40" pattern="[a-zA-Z]+[ ]+[a-zA-Z]+" maxlength="30" placeholder="Enter First & Last Name" required title="Only Letters and add a space"><br />
 <input type="text" name="username" size="40" pattern=".[a-z0-9]{4,10}" required title="Either 4-10 Characters & only numbers/letters" placeholder="Enter Username" ><br />
 <input type="email" name="email" size="40" placeholder="Enter Email" pattern="[a-z0-9._]+@[a-z0-9]+\.[a-z]{2,3}$" required title="Error!! Make sure your email contains the following... 1. @ sign 2. Three letters in domain name 3. Only numbers/characters and _ & . may be used. "><br />
 <input type="password" id="password" name="password"  size="40" pattern=".{6,}" required title="6 characters minimum" placeholder="Enter Password" ><br />
 <input type="password" id="repeat_password" name="repeat_password" size="40" pattern=".{6,}" required title="6 characters minimum" placeholder="Enter Password Again"><br />
 
 <input type="submit" value="Submit" id="submit" value="checkpassword" onclick="checkpassword()">
 </form></div>
 <script>
 
 </script>
 </body>
 
 
 
 
 </body>
 </html>
   `;
   response.send(str);
});

 // Process registration form POST method and redirect to invoice page if ok or back to registration page if not
app.post("/registration.html", function (request, response) {
   // process a simple register form
   console.log(photoquant);
   the_username= request.body.username;
   username = request.body.username;//Save new user to file name (users_reg_data)
   errors = [];//Checks to see if username already exists
 //Username Validation
if (typeof users_reg_data[username] != 'undefined'){
errors.push("Username is Already in Use");
}
console.log(errors, users_reg_data);
//If there are 0 errors, request all registration info
if (errors.length == 0){
   users_reg_data[username] = {};
   users_reg_data[username].username = request.body.username
   users_reg_data[username].password = request.body.password;
   users_reg_data[username].email = request.body.email;
   users_reg_data[username].fullname = request.body.fullname;
 
fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //Writes registration info into the userdata json file
theQuantQuerystring = qs.stringify(photoquant); //Turns quantity object into a string
   response.redirect("/purchase.html?" + theQuantQuerystring + `&username=${the_username}`); //If all good, send to the invoice page with username/quantity info
} else { 
   response.redirect('/registration.html?' + 'try again'); //if there are errors, send back to registration page to retype
}
   
});





app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path); //respond to HTTP request by sending type of request and the path of request
   next(); //calls the middleware function
});
app.use(express.static('./public')); //sets up a request to respond to GET and looks for the file from public (sets up static web server)
app.listen(8080, () => console.log(`listening on port 8080`)); //listens on Port 8080