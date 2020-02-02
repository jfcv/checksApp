# Checks Monitoring Application

Uptime Monitoring - Made Simple. We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. 
When your site goes down, we\'ll send you a text to let you know.

## Reason

This application was made while developing the Complete Course **The Node JS Master Class - No Frameworks, No NPM, No Dependencies**.

## Projects developed

* A RESTful API.
* A web app GUI
* A terminal based CLI (Command-line program)

## Lessons Learned

### RESTful API
The whole process of validating and sanitizing the information received for the every request.
The environments configuration for **staging**, **testing** and **production**.
The server related tasks involved in handling information like: **URL parsing**, **path**, **queryStringObject**, **method utilized**, **headers**, etc.
Handling the response with the **status code** and its **payload** as long as the **content-type**.
The **http** and **https** server configuration including the **SSL** self-signed **certificate** and its **key**.
The routing process and its relation with the handlers.
The passwords **hashing** process.
Crafting **HTTP requests** to an **API** (validating information, payload, requestDetails, sending the request, handling the errors).
The **CRUD** process for the every functionality on the application: users, tokens, checks.
Raw **static assets** handlers as long as the HTML handlers in the backend.
Even creating a template handler for standarizing every view on the frontend.

Modules involved:
 **fs** - **http** - **crypto** - **lib** - **string decoder** - **path** - **util** - **debug** - **url** - **dns**

### A web app GUI
Its major purpose was to consume the API built even getting to create complex templated views with Node. 

### A terminal based CLI
Command-line appllication that takes user-inputs from the console, processes them, a writes outputs back out. 
Its main function was to give out useful information to the user on the backend side (os information as long as users,
logs and checks information).

Modules involved:
**events** - **TTY** - **V8** - **OS**

### Stability
Using the Node built-in assertion library for writing unit tests and testing the **API** over **HTTP**.
Using the debugger to pinpoint issues during execution.
Finding syntax errors with **strict**.
**assert** - **strict** - **inspect**

### Performance
Basically using **performance hooks** to time the execution of certain processes. Also used **cluster** for activating every core 
on the machine running the app and **child processes**.

Modules involved:
**performance hooks** - **cluster** - **child processes**

### Bonus
Getting experience with HTTP2, VM, UDP, Net, TLS on Node JS.

Modules involved:
**HTTP2** - **VM** - **UDP** - **Net** - **TLS** - **REPL**

## Challenges
* Crafting the data.js library as a way to saving information in the same OS the app was running. It was literally like making my own DB.

## Good practices
* Modularity.
* **Git** as a version control system.
* API Testing using **POSTMAN**.

## Author

* **velveet** - [velveet](https://github.com/velveet) - FullStack Developer

## Acknowledgements

* [Skillshare](https://www.skillshare.com/home) - Great Lessons to Learn There!
