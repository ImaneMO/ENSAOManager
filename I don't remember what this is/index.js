const express = require("express")
const httpMsgs = require("http-msgs");
const jwtLogin = require("jwt-login");
const bodyparser = require("body-parser");
const roles = require("user-groups-roles");

const app = express();
app.listen(8010);
app.use(bodyparser.urlencoded({extended : false}));

/*
    Roles declaration
 */

//Roles
roles.createNewRole("admin");
roles.createNewRole("professeur");
roles.createNewRole("etudiant");

//Privileges
roles.createNewPrivileges(["/student","GET"],"get students",true);
roles.createNewPrivileges(["/student","POST"],"insert students",false);
roles.createNewPrivileges(["/student","PUT"],"edit students",false);
roles.createNewPrivileges(["/student","DELETE"],"delete students",true);

//Admin roles
roles.addPrivilegeToRole("admin",["/student","POST"],true);
roles.addPrivilegeToRole("admin",["/student","PUT"],true);
roles.addPrivilegeToRole("admin",["/student","DELETE"],true);

//Professeur roles
roles.addPrivilegeToRole("professeur",["/student","GET"],true);

//Etudiant can only select and submit quizzes


//Login HTML file
app.get("/login", function(req,res){
    res.sendFile(__dirname +"/public/app/login/index.html");
});

app.get("/post", function(req,res){
    res.sendFile(__dirname +"/public/app/usrRoles/post.html");
});

app.get("/put", function(req,res){
    res.sendFile(__dirname +"/public/app/usrRoles/put.html");
});

app.get("/delete", function(req,res){
    res.sendFile(__dirname +"/public/app/usrRoles/delete.html");
});


//Login
app.post("/login", function(req, res){
    var user = req.body.user
    var password = req.body.password
    if(user == password){
        jwtLogin.sign(req, res, user, "topsecret", 1, false);
    }else{
        httpMsgs.send500(req, res, "invalid user");
    }
});

//Logout
app.get("/logout", function(req, res){
    jwtLogin.signout(req, res, false);
});

var valid_login = function(req, res, next){
    try{
        req.jwt = jwtLogin.validate_login(req, res);
        next();
    } catch(error){
        httpMsgs.send500(req, res, error);
    }
}

/*
==============================================
                ROUTES
==============================================
 */

app.get("/student", valid_login, function(req, res){
    var user = req.jwt.user // this is the user
    var role = model.getroles(user);

    var value = roles.getRoleRoutePrivilegeValue(role, "/student", "GET");
    if(value){
        httpMsgs.sendJSON(req, res,{
            from : "get"
        });
    }else{
        httpMsgs.send500(req, res, "not allowed");
    }
});

app.post("/student", valid_login, function(req, res){
    var user = req.jwt.user // this is the user
    var role = model.getroles(user);

    var value = roles.getRoleRoutePrivilegeValue(role, "/student", "POST");
    if(value){
        httpMsgs.sendJSON(req, res,{
            from : "post"
        });
    }else{
        httpMsgs.send500(req, res, "not allowed");
    }
});

app.put("/student", valid_login, function(req, res){
    var user = req.jwt.user // this is the user
    var role = model.getroles(user);

    var value = roles.getRoleRoutePrivilegeValue(role, "/student", "PUT");
    if(value){
        httpMsgs.sendJSON(req, res,{
            from : "put"
        });
    }else{
        httpMsgs.send500(req, res, "not allowed");
    }
});

app.delete("/student", valid_login, function(req, res){
    var user = req.jwt.user // this is the user
    var role = model.getroles(user);

    var value = roles.getRoleRoutePrivilegeValue(role, "/student", "DELETE");
    if(value){
        httpMsgs.sendJSON(req, res,{
            from : "DELETE"
        });
    }else{
        httpMsgs.send500(req, res, "not allowed");
    }
});

