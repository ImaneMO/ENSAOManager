var usersRoles = {
    admin : "admin",
    professeur : "professeur",
    etudiant : "etudiant"
}

module.exports.getroles = function(user){
    return usersRoles[user];
}
