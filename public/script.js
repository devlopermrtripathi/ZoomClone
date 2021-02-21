const socket = io('/');
const videoGrid = document.getElementById('video-grid');

var peer = new Peer(undefined,{
    path : '/peerjs',
    host : '/',
    port : 3000
});

let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true ;

navigator.mediaDevices.getUserMedia({
    audio : true, // here we can identify whether the audio property should be available or not
    video : true  // here we can identify whether the video property should be available or not  
}).then(stream => {
    //It returns a stream object if there is no error 
    myVideoStream = stream;
    addVideoStream(myVideo,stream);

    peer.on('call', call=>{
        call.answer(stream);
        const video = document.createElement('video');
        video.className = 'Client-1' ;
        call.on('stream',userVideoStream=>{
            addVideoStream(video,stream);
        })
    })
    socket.on('user-connected',userId=>{
        connectNewUser(userId,stream);
    })
}).catch(err => {
    console.log(err);
    alert('Error while fetching the video information')
})

peer.on('open', (id)=>{
    socket.emit('join-room',ROOM_ID,id); // This is responsible for sending a message 
})


const connectNewUser = (userId,stream) =>{
    alert('hi..')
    const call  = peer.call(userId,stream);
    const video = document.createElement('video');
    video.className = 'Client-2' ;
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
}

const addVideoStream = (myVideo,stream) => {
    myVideo.srcObject = stream; // source for the video tag it can be anything like a video file or anything
    myVideo.addEventListener('loadedmetadata',()=>{ // when the video is loaded successfully this will be passed 
        myVideo.play() 
    })
    videoGrid.append(myVideo); // appended the video object
}

let text = $('input');

$(document).ready(()=>{
    $('#main_chat_button').click(()=>{
    socket.emit('message',text.val());
    text.val('')        
    })
})

socket.on('createMessage', message =>{
    const liElement = `<li class='message'><b>User</b><br>${message}</li>`;
    $('ul').append(liElement);
})

const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        unMuteMic();
        myVideoStream.getAudioTracks()[0].enabled = false;
    }else{
        muteMic();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const muteMic = () =>{
    const main_control_button = document.getElementById('main_mute_button');
    const muteHtml = `<i class="fas fa-microphone"></i> <span>Mute</span>`;
    main_control_button.innerHTML = muteHtml;
}

const unMuteMic = () =>{
    const main_control_button = document.getElementById('main_mute_button');
    const unmuteHtml = `<i class="fas fa-microphone-slash"></i> <span>Unmute</span>`;
    main_control_button.innerHTML = unmuteHtml;
}

const disableVideo = () =>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        disableScreenVideo();
        myVideoStream.getVideoTracks()[0].enabled = false
    }else{
        enableVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const enableVideo = () =>{
    const main_video_button = document.getElementById('main_video_button');
    const muteHtml = `<i class="fas fa-video"></i> <span>Stop Video</span>`;
    main_video_button.innerHTML = muteHtml;
}

const disableScreenVideo = () =>{
    const main_video_button = document.getElementById('main_video_button');
    const unmuteHtml = `<i class="fas fa-video-slash"></i> <span>Play Video</span>`;
    main_video_button.innerHTML = unmuteHtml;
}