const socket = io();

// Elements
const $img = document.querySelector("#img")
const $setupBtn = document.querySelector("#setup-btn")
const $playBtn = document.querySelector('#play-btn')
const $pauseBtn = document.querySelector('#pause-btn')

$setupBtn.addEventListener('click', () => {
    socket.emit('setup')
})
$playBtn.addEventListener('click', () => {
    socket.emit('play')
})
$pauseBtn.addEventListener('click', () => {
    socket.emit('pause')
})

socket.on('frameResponse', (frame) => {
    console.log('received' + frame.length)
    $img.src = "data:image/jpeg;base64," + frame;
})