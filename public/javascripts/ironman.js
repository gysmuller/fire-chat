// grab the room from the URL
var room = location.search && location.search.split('?')[1];

// create our webrtc connection
var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false
});

// when it's ready, join if we got a room from the URL
webrtc.on('readyToCall', function () {
    // you can name it anything
    if (room) webrtc.joinRoom(room);
});

//get called when another client gets added
webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    var remotes = document.getElementById('remotes');
    if (remotes) {
        var d = document.createElement('div');
        d.className = 'videoContainer';
        d.id = 'peer_' + peer.id;
        d.appendChild(video);
        var vol = document.createElement('div');
        vol.id = 'volume_' + peer.id;
        vol.className = 'volume_bar';
        d.appendChild(vol);
        remotes.appendChild(d);
    }
});
//gets calle when client are removed
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video added', peer);
    var remotes = document.getElementById('remotes');
    var el = document.getElementById('peer_' + peer.id);
    if (remotes && el) {
        remotes.removeChild(el);
    }
});

// Since we use this twice we put it here
function setRoom(name) {
    $('.form-container').remove();
    $('h1').text(name);
    $('#subTitle').text('Link to join: ' + location.href);
    $('body').addClass('active');
}

if (room) {
    setRoom(room);
} else {
    $('form').submit(function () {
        var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
        webrtc.createRoom(val, function (err, name) {
            console.log(' create room cb', arguments);
        
            var newUrl = location.pathname + '?' + name;
            if (!err) {
                history.replaceState({foo: 'bar'}, null, newUrl);
                setRoom(name);
            } else {
                console.log(err);
            }
        });
        return false;          
    });
}


/*
var button = $('#screenShareButton'),
    setButton = function (bool) {
        button.text(bool ? 'share screen' : 'stop sharing');
    };
    

webrtc.on('localScreenRemoved', function () {
    setButton(true);
});

setButton(true);

button.click(function () {
    if (webrtc.getLocalScreen()) {
        webrtc.stopScreenShare();
        setButton(true);
    } else {
        webrtc.shareScreen(function (err) {
            if (err) {
                setButton(true);
            } else {
                setButton(false);
            }
        });
        
    }
});

*/