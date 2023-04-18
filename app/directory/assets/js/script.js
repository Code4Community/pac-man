/*

    [========================]
    [  Project: C4C - Pacman ]
    [  Code: -> Static <-    ]
    [  Version: 1.23         ]
    [========================]



    CONSOLE FILTER: 

    -url:https://www.youtube.com/ptracking?html5=1&video_id=TlB_eWDSMt4&cpn=EvxaWiVgia0FDEEy&ei=pkzYY9LxJ5G1lAOM_ZvQAw&ptk=youtube_single&oid=dd27ZRUsSZTSZjk8fxaoWQ&ptchn=Wv7vMbMWH4-V0ZXdmDpPBA&pltype=content -url:https://www.youtube.com/api/stats/qoe?fmt=398&afmt=251&cpn=EvxaWiVgia0FDEEy&el=embedded&ns=yt&fexp=23983296%2C24004644%2C24007246%2C24080738%2C24135310%2C24169501%2C24219381%2C24255163%2C24415864%2C24436456%2C24439360%2C24451033&cl=501313814&seq=1&docid=TlB_eWDSMt4&ei=pkzYY9LxJ5G1lAOM_ZvQAw&event=streamingstats&plid=AAXzgzebA67748Xl&referrer=https%3A%2F%2Fwww.youtube.com%2Fembed%2FTlB_eWDSMt4&cbrand=apple&cbr=Opera&cbrver=94.0.0.0&c=WEB_EMBEDDED_PLAYER&cver=1.20230111.01.00&cplayer=UNIPLAYER&cos=Macintosh&cosver=10_15_7&cplatform=DESKTOP&vps=0.000:N,0.012:B,0.231:B,0.231:B&cmt=0.012:0.000,0.231:0.000&afs=0.231:251::i&vfs=0.231:398:398::r&view=0.231:1093:405:1.600000023841858&bwe=0.231:3580335&bat=0.231:1:1&vis=0.231:0&bh=0.231:0.000 -url:https://www.youtube.com/api/stats/qoe?fmt=398&afmt=251&cpn=EvxaWiVgia0FDEEy&el=embedded&ns=yt&fexp=23983296%2C24004644%2C24007246%2C24080738%2C24135310%2C24169501%2C24219381%2C24255163%2C24415864%2C24436456%2C24439360%2C24451033&cl=501313814&seq=2&docid=TlB_eWDSMt4&ei=pkzYY9LxJ5G1lAOM_ZvQAw&event=streamingstats&plid=AAXzgzebA67748Xl&referrer=https%3A%2F%2Fwww.youtube.com%2Fembed%2FTlB_eWDSMt4&cbrand=apple&cbr=Opera&cbrver=94.0.0.0&c=WEB_EMBEDDED_PLAYER&cver=1.20230111.01.00&cplayer=UNIPLAYER&cos=Macintosh&cosver=10_15_7&cplatform=DESKTOP&bh=0.400:7.801,10.001:28.870&cmt=0.400:0.001,1.152:0.724,1.552:1.124,10.001:1.131&vps=0.400:PL,1.552:PA&user_intent=0&bwm=10.001:2854199:0.453&bwe=10.001:3089992&bat=10.001:1:1&vis=10.001:3&df=10.001:0 -url:https://www.youtube.com/pagead/viewthroughconversion/962985656/?backend=innertube&cname=56&cver=20230111&foc_id=Wv7vMbMWH4-V0ZXdmDpPBA&label=followon_view&ptype=no_rmkt&random=275147207 -url:https://static.doubleclick.net/instream/ad_status.js -url:https://googleads.g.doubleclick.net/pagead/id -url:https://www.youtube.com/youtubei/v1/log_event?alt=json&key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8 -url:https://play.google.com/log?format=json&hasfast=true&authuser=0

*/

var login = document.querySelector('#login');
var regis = document.querySelector('#register');
var updat = document.querySelector('#update');
var delet = document.querySelector('#delete');



console.clear()
console.log(`

▐▓█▀▀▀▀▀▀▀▀▀█▓▌░▄▄▄▄▄░
▐▓█░PAC-MAN░█▓▌░█▄▄▄█░
▐▓█░░░░░░░░░█▓▌░█▄▄▄█░
▐▓█▄▄▄▄▄▄▄▄▄█▓▌░█████░
░░░░▄▄███▄▄░░░░░█████░

  <-[  Active  ]-> 

`)


if(login) {
    login.addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.querySelector('#user').value;
        const password = document.querySelector('#pass').value;
            
        fetch('/login', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer abcdxyz',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
        if (data.result == '[*] Correct Password...') {
            localStorage.logged_in = true 
            localStorage.userauth = data.userauth
            localStorage.username = data.username
            window.location.reload();
        } else{
            alert(data.result);
            window.location.reload();
        }
    });
    });
}

if(regis) {
    regis.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.querySelector('#user').value;

    const password = document.querySelector('#pass').value;
        
    fetch('/register', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer abcdxyz',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        }),
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.result == '[*] Complete...') {
                localStorage.logged_in = true 
                localStorage.userauth = data.userauth
                localStorage.username = data.username
                window.location.reload();
            } else{
                alert(data.result);
                window.location.reload();
            }
        });
    });
}

if(updat) {
    updat.addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.querySelector('#user').value;
        const userauth = localStorage.userauth;
        const code = document.querySelector('#code').value;
        let newpass = document.querySelector('#newpass').value;
        const pass = document.querySelector('#pass').value;

        if(newpass.length < 1){
            newpass = null;
        }

        console.log(newpass)
            
        fetch('/update', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer abcdxyz',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                userauth,
                newpass,
                pass,
                code
            }),
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
        if (data.result == '[*] Update Pass Sucess...' || data.result == '[*] Update Sucess...') {
            console.log(data);
            localStorage.userauth = data.userauth;
            window.location.reload();
        } else{
            alert(data.result);
            window.location.reload();
        }
    });
    });
}

if(delet) {
    delet.addEventListener('click', (e) => {
        e.preventDefault();
        const username = localStorage.username;
        const userauth = localStorage.userauth;
        const password = document.querySelector('#pass').value;
            
        fetch('/delete', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer abcdxyz',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                userauth,
                password,
            }),
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
        console.log(data);
        localStorage.logged_in = false;
        window.location.reload();
    });
    });
}

function getAllPac(){
    fetch('/users', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer abcdxyz',
            'Content-Type': 'application/json',
        },
    })
    .then((res) => {
        return res.json();
    })
    .then((data) => {

        var olddata = document.getElementById('pac-lead').getElementsByTagName('li');

        Array.from(olddata).forEach(function (element) {
            element.remove();
        });

       const entries = Object.entries(data);
       entries.forEach((users)=>{
        const node = document.querySelector('#pac-lead');

        var listItem = document.createElement('li');
        var listAttr = document.createElement('pe');
        var listScore = document.createElement('small');

        var number = Math.floor(Math.random() * 200) + Math.floor(Math.random() * 200);

        listItem.setAttribute('style','margin: 15px;border: 1.75px solid whitesmoke;');
        listAttr.setAttribute('style','margin-left: 15px;');
        listScore.setAttribute('style', 'float: right; margin-right: 15px;');

        listAttr.innerText = users[0];
        listScore.innerText = number;

        listItem.appendChild(listAttr);
        listItem.appendChild(listScore);

        node.appendChild(listItem);
        //console.log(users[1]);
       });
    });
}

function getAllGhost(){
    fetch('/users', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer abcdxyz',
            'Content-Type': 'application/json',
        },
    })
    .then((res) => {
        return res.json();
    })
    .then((data) => {

        var olddata = document.getElementById('ghost-lead').getElementsByTagName('li');

        Array.from(olddata).forEach(function (element) {
            element.remove();
        });

       const entries = Object.entries(data);
       entries.forEach((users)=>{
        const node = document.querySelector('#ghost-lead');

        var listItem = document.createElement('li');
        var listAttr = document.createElement('pe');
        var listScore = document.createElement('small');

        var number = Math.floor(Math.random() * 200) + Math.floor(Math.random() * 200);

        listItem.setAttribute('style','margin: 15px; border: 1.75px solid whitesmoke;');
        listAttr.setAttribute('style','margin-left: 15px;');
        listScore.setAttribute('style', 'float: right; margin-right: 15px;');

        listAttr.innerText = users[0];
        listScore.innerText = number;

        listItem.appendChild(listAttr);
        listItem.appendChild(listScore);

        node.appendChild(listItem);
        //console.log(users[1]);
       });
    });
}

function turnOn(eid) {

    if(eid == 'lead'){
        getAllPac();
        getAllGhost();
    }

    document.getElementsByClassName('xcontainer')[0].style.display = 'none';
    document.getElementById(eid).style.display = '';
}

function turnOff(id) {
    document.getElementsByClassName('xcontainer')[0].style = '';
    document.getElementById(id).style.display = 'none';
}

function loadcode(username) {
    fetch('/code', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer abcdxyz',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username
        }),
    })
      .then((res) => {
          return res.json();
      })
      .then((data) => {
        if(data != '[-] No User...'){
            loading = data.code.toString().split('\n').reverse();
            loading.forEach((item)=> {
                var tableRow = document.querySelector('.cm-line');
                var tableRowClone = tableRow.cloneNode(true);
                tableRowClone.innerText = item;
                tableRow.parentNode.insertBefore(tableRowClone, tableRow.nextSibling);
            });
        }
  });
}

function saveCode() {
    var code = document.querySelector('.cm-content').innerText;

    fetch('/update', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer abcdxyz',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: localStorage.username,
            userauth: localStorage.userauth,
            code: code,
            newpass: null
        }),
     })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
      });

    return code
}

function chechLogin() {
    let status = localStorage.logged_in;
    let path = window.location.pathname;

    if(status == null){
        localStorage.logged_in = false;
        status = 'false';
    }

    if(status == 'true'){
        if (path == '/login' || path == '/register') {
            window.location.replace('/');
        } else if(path == '/pacman'){
            document.getElementById('loginc').style.display = '';
            //loadcode(localStorage.username);
            console.log('[*] Current path: [ -< Home >- ]');
        } else if(path == '/account'){
            document.getElementById('loginc').style.display = '';
            fetch('/code', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer abcdxyz',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: localStorage.username
                }),
            })
              .then((res) => {
                  return res.json();
              })
              .then((data) => {
                if(data != '[-] No User...'){
                document.querySelector("#code").value = data.code.toString();
             }
            });
            document.querySelector("#user").value = localStorage.username;
        }
        else {
            document.getElementById('loginc').style.display = '';
            console.log('[*] Current path: '+path);
        }
    } else{
        if (path == '/login' || path == '/register') {
            console.log('[*] Current path: '+path);
        } else {
            window.location.replace('/login');
        }
    }
}

function previous() {
    let old =  document.getElementsByClassName("r-videos-active")[0];

    let newV = document.getElementById(JSON.stringify(parseInt(old.id) - 1))


    if(!newV){
        old.style.display = "none"
        old.className = "row r-videos"

        let fix = document.getElementById('0');
        fix.style.display = "flex";
        fix.className = "row r-videos-active"
    
    } else{

    old.style.display = "none"
    old.className = "row r-videos"


    newV.style.display = "flex";
    newV.className = "row r-videos-active"
    }
}

function next() {
    
        let old =  document.getElementsByClassName("r-videos-active")[0];

        let newV = document.getElementById(JSON.stringify(parseInt(old.id) + 1))


        if(!newV){
            let fix = document.getElementById('0');
            fix.style.display = "flex";
            fix.className = "row r-videos-active"
        } else{

        old.style.display = "none"
        old.className = "row r-videos"


        newV.style.display = "flex";
        newV.className = "row r-videos-active"
        }

}

chechLogin();


// function music(onf) {
// 	document.getElementById("myAudio").play(); 
// }