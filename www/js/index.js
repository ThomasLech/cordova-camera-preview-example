// index.js

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // Method below REQUIRES elements we removed from body in index.html
        // So we should comment it out.
        // this.receivedEvent('deviceready');

        let options = {
            x: 0,
            y: 0,
            width: window.screen.width,
            height: window.screen.height,
            camera: CameraPreview.CAMERA_DIRECTION.BACK,
            toBack: true,
            tapPhoto: false,
            tapFocus: false,
            previewDrag: false
        };
        // Take a look at docs: https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview#methods
        CameraPreview.startCamera(options);

        // Create a rectangle & button
        var rect = document.createElement('div');
        var button = document.createElement('img');
        // Make button look nice
        button.src = "../img/btn_icon.png";

        // Add styles
        rect.className += 'rect_class';
        button.className += 'btn_class';

        // Append to body section
        document.body.appendChild(rect);
        document.body.appendChild(button);

        // Get rectangle coordinates
        var rect_coords = rect.getBoundingClientRect();
        var x_coord = rect_coords.left, y_coord = rect_coords.top;

        button.onclick = function(){
            // Get rect width and height
            var rect_width = rect.offsetWidth, rect_height = rect.offsetHeight;

            CameraPreview.takePicture(function(base64PictureData) {

                // We pass width, height, x and y coordinates of our rectangle to crop func
                // Our crop function return cropped image in base64 format
                var cropped_img = crop(base64PictureData, rect_width, rect_height, x_coord, y_coord);

                // Now we are ready to send cropped image TO SERVER
            })
        };
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();