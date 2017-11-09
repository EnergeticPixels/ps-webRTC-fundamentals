// shim to account for browser differences
navigator.getWebcam = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

// PeerJS object ** for production use, get your own key at http://peerjs.com/peerserver

var peer = new Peer({
	key: 'bj3sprycm7lj714i',
	debug: 3,
	config: {
		'iceServers': [
			// DO NOT USE GOOGLE for production. In production you will have to
			// protect username-passwords via some other means.
			{url: 'stun:stun.l.google.com:19302'},
			{url: 'stun:stun1.l.goodle.com:19302'},
			{url: 'turn:numb.viagenie.ca', username: 'energeticpixels@gmail.com', credential: 'Pickles!9090'}
		]
	}
});

// on open, set the peer id
peer.on('open', function() {
	$('#my-id').text(peer.id);
});

peer.on('call', function(call) {
	// Answer automatically for demo
	call.answer(window.localStream);
	step3(call);
});

// click handlers 
$(function() {
	$('#make-call').click(function() {
		//Initiate a call!
		var call = peer.call($('#callto-id').val(), window.localStream);
		step3(call);
	});
	$('#end-call').click(function() {
		window.existingCall.close();  // .close();
		step2();
	});

	// Retry if getUserMedia fails
	$('#step1-retry').click(function() {
		$('#step1-error').hide();
		step();
	});

	// Get things started
	step1();
});


function step1() {
	// get audio video stream
	navigator.getWebcam({audio: false, video: true}, function(stream) {
		//dispaly the video stream
		$('#my-video').prop('src', URL.createObjectURL(stream));

		window.localStream = stream;
		step2();
	}, function(){ $('#step1-error').show(); });
};

function step2() {
	// adjust the ui
	$('#step1', '#step3').hide();
	$('#step2').show();
}

function step3(call) {
	// Hang up on an existing call if present
	if (window.existingCall) {
		window.existingCall.close();
	}

	// Wait for stream on the call, then setup peer video
	call.on('stream', function(stream) {
		$('#their-video').prop('src', URL.createObjectURL(stream));
	});
	// UI stuff
	window.existingCall = call;
	$('#their-id').text(call.peer);
	call.on('close', step2);
	$('#step1, #step2').hide();
	$('#step3').show();
}