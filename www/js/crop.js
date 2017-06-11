// crop.js

var crop = function(base64PictureData) {

	var image = new Image();
	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext('2d');

	// var x_coord_int = Math.round(x_coord);
	// var y_coord_int = Math.round(y_coord);

	image.src = 'data:image/png;base64,' + base64PictureData;
	image.onload = function(){
		// if (image.width <)
		x_axis_scale = image.width / window.screen.width
		y_axis_scale = image.height / window.screen.height

		ctx.drawImage(image, 
						x_coord * x_axis_scale, y_coord * y_axis_scale, 
						width * x_axis_scale, height * y_axis_scale, 
						0, 0, width, height);

		// Send base64 data to back-end
		var cropped_img_base64 = canvas.toDataURL();

		$.post("http://10.0.0.67:8000/resolver/",
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