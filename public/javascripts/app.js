function goto () {
  this.closest('form').style.display = 'none' ;
  document.querySelector(this.getAttribute('href')).style.display = '';
}

function submitForm(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  let els = this.querySelectorAll('input, select, textarea') ;
  let datas = {} ;
  for (var i in els) {
    if(!els[i].type ||!els[i].name)
      continue ;
    if(els[i].type && ['radio', 'checkbox'].indexOf(els[i].type) !=-1) {
      if(!els[i].checked) {
        continue ;
      }
    }
    if (!!els[i].value)
      datas[els[i].name] = els[i].value ;
  }
  fetch(this.action, {
    method : this.getAttribute('method'),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials:'same-origin',
    body:JSON.stringify(datas) })
    .then(r => r.text())
    .then(response => {
      if(response === 'OK') {
        document.getElementById('loginArea').style.display = 'none' ;
        document.getElementById('postArea').style.display = '' ;
        document.getElementById('logout').style.display = '' ;
        document.getElementById('username').innerText = document.cookie.replace(/(?:(?:^|.*;\s*)loggedIn\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        return loadPosts() ;
      }
      if(response === 'ADDED') {
        return this.reset();
//        return loadPosts() ;
      }
      alert('Veuillez vérifier le formulaire');
  })
}

function loadPosts () {
  fetch('/posts', {credentials:'same-origin'}).then(r => r.json()).then(response => {
    document.getElementById('postList').innerHTML = response.response;
  });
//  document.getElementById('postList').innerText = 'Chargement des posts';
}
var socket ;

document.body.onload = evt => {
  let userName = document.cookie.replace(/(?:(?:^|.*;\s*)loggedIn\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if(userName) {
//    document.getElementById('username').innerText = userName ;
    loadPosts () ;
  }
  socket = io('http://localhost:8000');

  socket.on('post', function (data) {
    console.log(data);
    if(data)
    fetch('/posts/'+data, {credentials:'same-origin'}).then(r => r.json()).then(response => {
      document.getElementById('postList').innerHTML = response.response + document.getElementById('postList').innerHTML;
    });
  });
}
function logout (event) {
  event.stopPropagation();
  event.preventDefault();
  fetch(event.target.href, {method:'DELETE',credentials:'same-origin'})
    .then(r=>r.text())
    .then(r=>{
      document.getElementById('loginArea').style.display = '' ;
      document.getElementById('postArea').style.display = 'none' ;
      document.getElementById('logout').style.display = 'none' ;
      document.getElementById('username').innerText = 'userName' ;
    })
} ;
