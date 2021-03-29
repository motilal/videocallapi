'use strict';

apiRTC.setLogLevel(10);

var connectedSession = null;

function showAcceptDeclineButtons() {
    $('.modal').modal('hide');
    $('#acceptCallingModal').modal('show');
    //document.getElementById('accept').style.display = 'inline-block';
    //document.getElementById('decline').style.display = 'inline-block';
}

function hideAcceptDeclineButtons() {
    $("#accept").unbind("click");
    $("#decline").unbind("click");
    $('.modal').modal('hide');
    //document.getElementById('accept').style.display = 'none';
    //document.getElementById('decline').style.display = 'none';
}

function selectPhonebookItem(idItem) {
    $("#number").val(idItem);
}

function updateAddressBook() {
    console.log("updateAddressBook");

    //var contactListArray = connectedSession.getContactsArray(),
    var contactListArray = connectedSession.getOnlineContactsArray(), //Get online contacts
            i = 0;

    console.log("contactListArray :", contactListArray);

    //Cleaning addressBook list
    $("#addressBookDropDown").empty();

    for (i = 0; i < contactListArray.length; i += 1) {
        var user = contactListArray[i];
        console.log("userId :", user.getId());
        //Checking if connectedUser is not current user befire adding in addressBook list
        if (user.getId() !== apiRTC.session.apiCCId) {
            $("#addressBookDropDown").append('<li><a href="#" onclick="selectPhonebookItem(' + user.getId() + ')">' + user.getId() + '</a></li>');
        }
    }
}

//Function to add media stream in Div
function addStreamInDiv(stream, divId, mediaEltId, style, muted) {

    var streamIsVideo = stream.hasVideo();
    console.error('addStreamInDiv - hasVideo? ' + streamIsVideo);

    var mediaElt = null,
            divElement = null,
            funcFixIoS = null,
            promise = null;

    if (streamIsVideo === false) {
        mediaElt = document.createElement("audio");
    } else {
        mediaElt = document.createElement("video");
    }

    mediaElt.id = mediaEltId;
    mediaElt.autoplay = true;
    mediaElt.muted = muted;
    if (streamIsVideo === false) {
        mediaElt.controls = true;
    }
    mediaElt.style.width = style.width;
    mediaElt.style.height = style.height;

    funcFixIoS = function () {
        var promise = mediaElt.play();

        console.log('funcFixIoS');
        if (promise !== undefined) {
            promise.then(function () {
                // Autoplay started!
                console.log('Autoplay started');
                console.error('Audio is now activated');
                document.removeEventListener('touchstart', funcFixIoS);

                $('#status').empty().append('iOS / Safari : Audio is now activated');

            }).catch(function (error) {
                // Autoplay was prevented.
                console.error('Autoplay was prevented');
            });
        }
    };

    stream.attachToElement(mediaElt);

    divElement = document.getElementById(divId);
    divElement.appendChild(mediaElt);
    promise = mediaElt.play();

    if (promise !== undefined) {
        promise.then(function () {
            // Autoplay started!
            console.log('Autoplay started');
        }).catch(function (error) {
            // Autoplay was prevented.
            if (apiRTC.osName === "iOS") {
                console.info('iOS : Autoplay was prevented, activating touch event to start media play');
                //Show a UI element to let the user manually start playback

                //In our sample, we display a modal to inform user and use touchstart event to launch "play()"
                document.addEventListener('touchstart', funcFixIoS);
                console.error('WARNING : Audio autoplay was prevented by iOS, touch screen to activate audio');
                $('#status').empty().append('WARNING : iOS / Safari : Audio autoplay was prevented by iOS, touch screen to activate audio');
            } else {
                console.error('Autoplay was prevented');
            }
        });
    }
}

function setCallListeners(call) {
    call
            .on("localStreamAvailable", function (stream) {
                console.log('localStreamAvailable');
                $('.modal').modal('hide');
                $('#callingModal').modal('show');
                //document.getElementById('local-media').remove();
                var streamIsVideo = stream.hasVideo();
                if (streamIsVideo == true) {
                    addStreamInDiv(stream, 'local-container', 'local-media-' + stream.getId(), {width: "160px", height: "120px"}, true);
                }
                stream.on("stopped", function () { //When client receives an screenSharing call from another user
                    console.error("Stream stopped");
                    $('#local-media-' + stream.getId()).remove();
                });
            })
            .on("streamAdded", function (stream) {
                console.log('stream :', stream);
                $('.calling-text').hide();
                var streamIsVideo = stream.hasVideo();
                var vidstyle = {width: "640px", height: "480px"};
                $('.audio-container').addClass('video-container').removeClass('audio-container');
                if (streamIsVideo == false) {
                    vidstyle = {width: "640px", height: "200px"};
                    $('.video-container').addClass('audio-container').removeClass('video-container');
                }
                addStreamInDiv(stream, 'remote-container', 'remote-media-' + stream.getId(), vidstyle, false);
            })
            .on('streamRemoved', function (stream) {
                $('.modal').modal('hide');
                // Remove media element
                $('.calling-text').show();
                document.getElementById('remote-media-' + stream.getId()).remove();
            })
            .on('userMediaError', function (e) {
                console.log('userMediaError detected : ', e);
                console.log('userMediaError detected with error : ', e.error);

                //Checking if tryAudioCallActivated
                if (e.tryAudioCallActivated === false) {
                    $('.modal').modal('hide');
                    $('#hangup-' + call.getId()).remove();
                }
            })
            .on('hangup', function () {
                setTimeout(function () {
                    $('#hangup-' + call.getId()).remove();
                    $('.modal').modal('hide');
                }, 100);
            });
}

function callInvitationProcess(invitation) {

    invitation.on("statusChange", function (statusChangeInfo) {
        console.error('statusChangeInfo :', statusChangeInfo);

        if (statusChangeInfo.status === apiRTC.INVITATION_STATUS_EXPIRED) {

            console.error('INVITATION_STATUS_EXPIRED');
            // Hide accept/decline buttons
            hideAcceptDeclineButtons();
        }
    });

    //===============================================
    // ACCEPT OR DECLINE
    //===============================================
    // Display accept/decline buttons
    showAcceptDeclineButtons();

    // Add listeners
    $("#accept").click(function () {
        //==============================
        // ACCEPT CALL INVITATION
        //==============================
        if (invitation.getCallType() == 'audio') { //When receiving an audio call 
            var answerOptions = {
                mediaTypeForIncomingCall: 'AUDIO' //Answering with audio only.
            }
            invitation.accept(null, answerOptions)
                    .then(function (call) {
                        setCallListeners(call);
                        addHangupButton(call.getId());
                    });
        } else {
            invitation.accept() //Answering with audio and video.
                    .then(function (call) {
                        setCallListeners(call);
                        addHangupButton(call.getId());
                    });
        }
        // Hide accept/decline buttons
        hideAcceptDeclineButtons();
    });

    $("#decline").click(function () {
        // Decline call invitation
        invitation.decline();
        // Hide accept/decline buttons
        hideAcceptDeclineButtons();
    });

    $('#acceptCallingModal').on('hidden.bs.modal', function (e) {
        // Decline call invitation
        invitation.decline();
        // Hide accept/decline buttons
        hideAcceptDeclineButtons();
    });
}

//==============================
// CREATE USER AGENT
//==============================
var ua = new apiRTC.UserAgent({
    uri: 'apzkey:myDemoApiKey'
});

//==============================
// REGISTER
//==============================
ua.register({
    id: userid,
    //userAcceptOnIncomingScreenSharingCall: true
}).then(function (session) {
    // Save session
    connectedSession = session;
    // Display user number
    document.getElementById('my-number').innerHTML = 'Your number is ' + connectedSession.id;

    connectedSession
            .on("contactListUpdate", function (updatedContacts) { //display a list of connected users
                console.log("MAIN - contactListUpdate", updatedContacts);
                updateAddressBook();
            })
            //==============================
            // WHEN A CONTACT CALLS ME
            //==============================
            .on('incomingCall', function (invitation) {
                callInvitationProcess(invitation);
            });

}).catch(function (error) {
    // error
    console.error('User agent registration failed', error);
});

function hangupCall(callId) {
    console.log("hangupCall :", callId);
    $('#hangup-' + callId).remove();
    $('.modal').modal('hide');
    //Getting call from ApiRTC call lists
    var call = connectedSession.getCall(callId);
    call.hangUp();
}

function releaseStream(streamId) {
    console.log("releaseStream :", streamId);
    $('#relstream-' + streamId).remove();
    var stream = apiRTC.Stream.getStream(streamId);
    stream.release();
}

function addHangupButton(callId) {
    $("#hangupButtons").append('<input id="hangup-' + callId + '" class="btn btn-danger" type="button" value="Dismiss Call" onclick="hangupCall(' + callId + ')" />');
}

function checkUserIsOnline(callToId) {
    var contactListArray = connectedSession.getOnlineContactsArray(), //Get online contacts
            i = 0;
    for (i = 0; i < contactListArray.length; i += 1) {
        var user = contactListArray[i];
        if (user.getId() == callToId) {
            return true;
        }
    }
    return false;
}


//Audio Call establishment
$("#callAudio").click(function () {
    var callToId = $("#number").val();
    var contact = connectedSession.getOrCreateContact(callToId);
    var isonline = false;
    isonline = checkUserIsOnline(callToId);

    if (isonline == false) {
        alert('User is offline. Please try again');
        return;
    }


    var callOptions = {
        mediaTypeForOutgoingCall: 'AUDIO'
    };
    var call = contact.call(null, callOptions);
    if (call !== null) {
        setCallListeners(call);
        addHangupButton(call.getId());
        $('.video-container').addClass('audio-container').removeClass('video-container');
    } else {
        console.warn("Cannot establish call");
    }
});

//Call establishment
$("#callVideo").click(function () {
    var callToId = $("#number").val();
    var contact = connectedSession.getOrCreateContact(callToId);
    var isonline = false;
    isonline = checkUserIsOnline(callToId);

    if (isonline == false) {
        alert('User is offline. Please try again');
        return;
    }
    var call = contact.call();
    if (call !== null) {
        setCallListeners(call);
        addHangupButton(call.getId());
        $('.audio-container').addClass('video-container').removeClass('audio-container');
    } else {
        console.warn("Cannot establish call");
    }
});

