// crop.js

var crop = function(base64PictureData, rect_width, rect_height, x_coord, y_coord, callback) {

    // image variable will contain ORIGINAL image
    var image = new Image();

    // canvas variable will contain CROPPED image
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    // Load original image onto image object
    image.src = 'data:image/png;base64,' + base64PictureData;
    image.onload = function(){

        // Map rectangle onto image taken
        var x_axis_scale = image.width / window.screen.width
        var y_axis_scale = image.height / window.screen.height
        // INTERPOLATE
        var x_coord_int = x_coord * x_axis_scale;
        var y_coord_int = y_coord * y_axis_scale;
        var rect_width_int = rect_width * x_axis_scale;
        var rect_height_int = rect_height * y_axis_scale

        // Set canvas size equivalent to cropped image size
        canvas.width = rect_width_int;
        canvas.height = rect_height_int;

        ctx.drawImage(image,
            x_coord_int, y_coord_int,           // Start CROPPING from x_coord(interpolated) and y_coord(interpolated)
            rect_width_int, rect_height_int,    // Crop interpolated rectangle
            0, 0,                               // Place the result at 0, 0 in the canvas,
            rect_width_int, rect_height_int);   // Crop interpolated rectangle

        // Get base64 representation of cropped image
        var cropped_img_base64 = canvas.toDataURL();

        // Now we are ready to send cropped image TO SERVER
        callback(cropped_img_base64);

        return cropped_img_base64;
    };
};
