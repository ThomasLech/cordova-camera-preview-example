// crop.js

var crop = function(base64PictureData, rect_width, rect_height, x_coord, y_coord) {

	// image will contain ORIGINAL image
	var image = new Image();

	// image will contain CROPPED image
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	// Load original image into image element
	image.src = 'data:image/png;base64,' + base64PictureData;
	image.onload = function(){

		// Required to interpolate rectangle(from screen) into original image
		var x_axis_scale = image.width / window.screen.width
		var y_axis_scale = image.height / window.screen.height

		// INTERPOLATE
		var x_coord_int = x_coord * x_axis_scale;
		var y_coord_int = y_coord * y_axis_scale;
		var rect_width_int = rect_width * x_axis_scale;
		var rect_height_int = rect_height * y_axis_scale

		// Set canvas size equivalent to interpolated rectangle size
		canvas.width = rect_width_int;
		canvas.height = rect_height_int;

		ctx.drawImage(image, 
			x_coord_int, y_coord_int, 			// Start CROPPING from x_coord(interpolated) and y_coord(interpolated)
			rect_width_int, rect_height_int, 	// Crop interpolated rectangle
			0, 0, 								// Place the result at 0, 0 in the canvas,
			rect_width_int, rect_height_int);	// Crop interpolated rectangle

		// Get base64 representation of cropped image
		var cropped_img_base64 = canvas.toDataURL();

		// SEND cropped image to server
		$.post("end-point_name",
			{
				base64: cropped_img_base64
			},
			function done(data, textStatus, jqXHR){
				// alert("Data: " + data + "\nStatus: " + status);
			},
			function fail(jqXHR, textStatus, errorThrown){
				alert(textStatus + ', ' + errorThrown)
			}
		);

		// $.post('http://10.0.0.71:8000/resolver/', {base64: cropped_img_base64});
	};
};