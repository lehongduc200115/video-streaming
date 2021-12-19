const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));



io.on('connection', (socket) => {
    console.log("connected!");

    // Streaming manipulation
    var videoStream = ''
    currentLength = null
    currentFrame = null
    var isPause = false

    socket.on('setup', () => {
        videoStream = fs.createReadStream('movie.Mjpeg');
        console.log('setup!');
    })

    socket.on('play', () => {
        videoStream.on('readable', () => {
            while ( isPause == false
                && ((currentLength = (currentLength == null) ? (videoStream.read(5)) : currentLength) !=null)
                && (currentLength = (currentLength == null)?parseInt(currentLength.toString('utf-8')):currentLength) != null 
                && (currentFrame = (currentFrame == null && currentLength != null)?videoStream.read(currentLength):currentFrame) != null) {
                frame = currentFrame.toString('base64');
                currentLength = null;
                currentFrame = null;
                io.emit('frameResponse', frame);
                waitFor005sec();
            }
        })

        videoStream.on('error', (e) => {
            videoStream = fs.createReadStream('movie.Mjpeg');
        })
    })

    socket.on('pause', () => {
        isPause = !isPause;
        console.log('isPause', isPause)
    })
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});

waitFor005sec = () => {
    start = Date.now()
    while (Date.now() - start < 25) {}
}