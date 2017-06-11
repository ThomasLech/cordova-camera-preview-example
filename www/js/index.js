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
        var button = document.createElement('button');

        // Add styles
        rect.className += 'rect_class';
        button.className += 'btn_class';

        // Append to body section
        document.body.appendChild(rect);
        document.body.appendChild(button);

        // Get rectangle coordinates
        var rect_coords = rect.getBoundingClientRect();
        var x_coord = rect_coords.left, y_coord = rect_coords.top;

        
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