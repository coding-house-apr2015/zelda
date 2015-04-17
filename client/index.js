'use strict';

var root, users, me;

$(document).ready(init);

function init(){
  root = new Firebase('https://zelda-chyld.firebaseio.com/');
  users = root.child('users');
  $('#create-user').click(createUser);
  users.on('child_added', userAdded);
}

function userAdded(snapshot){
}

function createUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.createUser({
    email    : email,
    password : password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
    }
  });
}
