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
            tapFocus: true,
            previewDrag: false
        };

        var flash_mode = 'off';
        // Take a look at docs: https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview#methods
        CameraPreview.startCamera(options);


        // Create a rectangle & take_pic_btn
        var rect = document.createElement('div');
        var take_pic_btn = document.createElement('img');
        var flash_on_btn = document.createElement('img');
        var flash_off_btn = document.createElement('img');
        // Make take_pic_btn look nice
        // You must specify path relative to www folder
        take_pic_btn.src = 'img/btn_icon_mini.png';
        flash_on_btn.src = 'img/flash_on.svg';
        flash_off_btn.src = 'img/flash_off.svg';

        // Add styles
        rect.className += 'rect_class';
        take_pic_btn.className += 'btn_class';
        flash_on_btn.className += 'btn_class';
        flash_off_btn.className += 'btn_class';

        take_pic_btn.className += ' take_pic_class'
        flash_on_btn.className += ' flash_class'
        flash_off_btn.className += ' flash_class'

        // Hide flash_off btn by default
        flash_off_btn.style.visibility = 'hidden';

        // Append to body section
        document.body.appendChild(rect);
        document.body.appendChild(take_pic_btn);
        document.body.appendChild(flash_on_btn);
        document.body.appendChild(flash_off_btn);

        // Get rectangle coordinates
        var rect_coords = rect.getBoundingClientRect();
        var x_coord = rect_coords.left, y_coord = rect_coords.top;

        take_pic_btn.onclick = function(){
            // Get rect width and height
            var rect_width = rect.offsetWidth, rect_height = rect.offsetHeight;

            CameraPreview.takePicture(function(base64PictureData) {

                // We pass width, height, x and y coordinates of our rectangle to crop func
                // BEFORE crop function ends, it sends cropped base64 image to a server
                var cropped_img = crop(base64PictureData, rect_width, rect_height, x_coord, y_coord, function(cropped_img_base64) {

                    $.post("http://192.168.1.32:8000/api/images/create/",
                        {
                            image: cropped_img_base64
                        },
                        function(data, status, xhr) {
                            // Success callback
                            alert('Status: ' + status + '\nData: ' + data);
                        }
                    )
                    .fail(function(error, status, xhr) {
                        // Failure callback
                        alert('Status: ' + status + '\nReason: ' + xhr);
                    });

                });
            });
        };

        flash_on_btn.onclick = function() {
            flash_mode = 'on';
            flash_off_btn.style.visibility = 'visible';
            flash_on_btn.style.visibility = 'hidden';

            CameraPreview.setFlashMode(flash_mode);
        }

        flash_off_btn.onclick = function() {
            flash_mode = 'off';
            flash_off_btn.style.visibility = 'hidden';
            flash_on_btn.style.visibility = 'visible';

            CameraPreview.setFlashMode(flash_mode);
        }
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
