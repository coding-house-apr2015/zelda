/* global Firebase:true */

'use strict';

var root, characters, myKey;

$(document).ready(init);

function init(){
  root = new Firebase('https://zelda-chyld.firebaseio.com/');
  characters = root.child('characters');
  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#logout-user').click(logoutUser);
  $('#start-user').click(startUser);
  characters.on('child_added', characterAdded);
  characters.on('child_changed', characterChanged);
  $('#create-character').click(createCharacter);
}

function characterChanged(snapshot){
  var character = snapshot.val();
  var $td = $('#board td[data-x="'+character.x+'"][data-y="'+character.y+'"]');
  $('#board > tbody td.' + character.handle).css('background-image', '');
  $('#board > tbody td').removeClass(character.handle);
  $td.addClass(character.handle);
  $td.css('background-image', 'url("'+character.avatar+'")');
}

function createCharacter(){
  var handle = $('#handle').val();
  var avatar = $('#avatar').val();
  var uid = root.getAuth().uid;

  characters.push({
    handle: handle,
    avatar: avatar,
    uid: uid
  });
}

function characterAdded(snapshot){
  var character = snapshot.val();
  var myUid = root.getAuth() ? root.getAuth().uid : '';
  var active = '';

  if(myUid === character.uid){
    myKey = snapshot.key();
    active = 'active';
  }

  var tr = '<tr class="'+active+'"><td>'+character.handle+'</td><td><img src="'+character.avatar+'"></td></tr>';
  $('#characters > tbody').append(tr);
}

function logoutUser(){
  root.unauth();
  myKey = null;
  $('#characters > tbody > tr.active').removeClass('active');
}

function loginUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.authWithPassword({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error logging in:', error);
    }else{
      redrawCharacters();
    }
  });
}

function startUser(){
  var x = Math.floor(Math.random() * 10);
  var y = Math.floor(Math.random() * 10);
  characters.child(myKey).update({x:x, y:y});
}

function redrawCharacters(){
  $('#characters > tbody').empty();
  characters.off('child_added', characterAdded);
  characters.on('child_added', characterAdded);
}

function createUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.createUser({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error creating user:', error);
    }
  });
}
