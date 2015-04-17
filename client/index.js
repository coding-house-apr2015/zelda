/* global Firebase:true */

'use strict';

var root, characters, myKey, myCharacter, items;
var move = '/assets/move.wav';
var $sound;

$(document).ready(init);

function init(){
  root = new Firebase('https://zelda-chyld.firebaseio.com/');
  characters = root.child('characters');
  items = root.child('items');
  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#logout-user').click(logoutUser);
  $('#start-user').click(startUser);
  characters.on('child_added', characterAdded);
  items.on('child_added', itemAdded);
  characters.on('child_changed', characterChanged);
  $('#create-character').click(createCharacter);
  $(document).keydown(keyDown);
  $sound = $('#sound');
  startTimer();
}

function itemAdded(snapshot){
  var item = snapshot.val();
  console.log('item', item);
}

function startTimer(){
  //setInterval(dropItems, 1000);
}

function dropItems(){
  var names = ['health', 'weapon', 'blackhole'];
  var rnd = Math.floor(Math.random() * names.length);
  var name = names[rnd];
  items.push({
    name: name,
    sound: '/assets/' + name + '.wav'
  });
}

function keyDown(event){
  $sound.attr('src', move);
  $sound[0].play();

  var x = $('.' + myCharacter.handle).data('x');
  var y = $('.' + myCharacter.handle).data('y');
  switch(event.keyCode){
    case 37:
      x -= 1;
      break;
    case 38:
      y -= 1;
      break;
    case 39:
      x += 1;
      break;
    case 40:
      y += 1;
  }
  characters.child(myKey).update({x:x, y:y});
  event.preventDefault();
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
    myCharacter = character;
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
