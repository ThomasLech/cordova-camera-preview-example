---
layout: post
title: Beautiful camera preview with cordova
date: '2017-06-09 22:21:03 +0200'
categories: jekyll update
published: true
---


Hi, recently I wanted to build a mobile app for my ML project.  

As usual I was planning to acomplish this with java.  
I started searching through Android forums and its community to find out more about manipulating camera preview.  
However, to my surprise I found it **hard to fully understand tens or hundreds lines of tedious code**.  
I felt frustrated at first. So searching desperately for easier solutions I came across Cordova framework.  
In fact there are several frameworks for building hybrid mobile apps.



## Most popular frameworks:
- IONIC  
**Ionic has strong AngularJS influence**. So if you're not familiar with AngularJS, you might want to try other frameworks.
- CORDOVA  
[Cordova][cordova-docs] is an open source project supported by Apache.  
This is the **simplest and fastest** framework to use.
- PHONEGAP  
[PhoneGap][phonegap-docs] is Adobe's distribution of Cordova. PhoneGap is powered by Cordova but has a separate command line tool.  
[PhoneGap Build][phonegap-build-docs] is a service provided by Adobe. With PhoneGap Build, you upload your HTML, CSS and JavaScript to Adobe's servers and they build native applications for you.  
The major benefit is that you **don't have to have the native SDKs installed on your computer**.  
**This lets you do things like build iOS application from Windows**.

**NOTE**: You definitely should read about [cons of building a hybrid app][cons-hybrid] before building any other native apps.



## Easy Cordova setup:
1. **Install nodejs**. Nodejs is a package manager, distributing javascript packages inluding cordova, phonegap and ionic.  
`sudo apt-get install nodejs`

2. **Install Cordova via nodejs**:  
`npm install -g cordova`

3. **Create a new project**:  
`cordova create path/to/myApp`

4. **Add platforms**. Before building your app on a particular platform you must have it previously added.  
`cordova platform add <platform_name>`  
To see all available platforms, run:  
`cordova platform`

5. **Add** camera preview plugin:  
`cordova plugin add cordova-plugin-camera-preview`  


**NOTE**: For some reason emulator appear not to take cordova-camera-preview plugin into consideration.  
However, **building the app directly on mobile device does the trick**.



## Camera preview

**_index.html_**
{% highlight html %}
<body>
    <script type="text/javascript" src="cordova.js"></script>
    <!-- crop.js contains our crop function -->
    <script type="text/javascript" src="js/crop.js"></script>
    <script type="text/javascript" src="js/index.js"></script>
</body>
{% endhighlight %}
We remove all redundant code from body section **except script tags**.  
Notice **_crop.js_** file. Later in this post we will define crop function there.


**_index.js_**
{% highlight javascript %}
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
    // You must specify path relative to www folder
    button.src = 'img/btn_icon_mini.png';

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
{% endhighlight %}
First, locate **onDeviceReady** method defined in **_index.js_**.  
So, inside onDeviceReady function body, we start camera activity with specific options set.  
Next, we create rectangle & submit button. When button is clicked we **crop area set by the rectangle**.



**_crop.js_**
{% highlight javascript %}
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
            x_coord_int, y_coord_int,           // Start CROPPING from x_coord(interpolated) and y_coord(interpolated)
            rect_width_int, rect_height_int,    // Crop interpolated rectangle
            0, 0,                               // Place the result at 0, 0 in the canvas,
            rect_width_int, rect_height_int);   // Crop interpolated rectangle

        // Get base64 representation of cropped image
        var cropped_img_base64 = canvas.toDataURL();

        return cropped_img_base64;
    };
};
{% endhighlight %}



**_index.css_**
{% highlight css %}
div.rect_class {
    width: 280px;
    height: 100px;

    /* Make inner part of rectangle transparent */
    background-color: rgba(255, 255, 255, 0);

    /* Center vertically AND horizontally */
    position: absolute; /*it can be fixed too*/
    left: 0; right: 0;
    top: 0; bottom: 0;
    margin: auto;

    /* This to solve "the content will not be cut when the window is smaller than the content": */
    max-width: 100%;
    max-height: 100%;
    overflow: auto;

    /* COOL BORDER */
    border-width: 20px;
    border-style: solid;
    /* You need to place border.png into img folder */
    border-image: url(../img/border.png) 50 round;

    /* SHADOW EFFECT darkens everything outside rectangle */
    box-shadow: 0 0 500px 5000px rgba(0, 0, 0, 0.65);
}

img.btn_class {
    width: 75px;
    height: 75px;

    /* Center horizontally */
    position: absolute; /*it can be fixed too*/
    left: 0; right: 0;
    bottom: 50px;
    margin: auto;
}
{% endhighlight %}



## Results
![cordova-camera-preview-results](https://user-images.githubusercontent.com/22115481/27040520-85f44652-4f91-11e7-8e48-9a5334675414.png)



## Conclusion
Now, we are left with **encoded cropped image**. We can send it to the server, so that we get prediction back.  
In the next session, I'll show you how to handle such a request with **Django REST framework**.  
After that I'll build **predictive model** to recognise **digits combined with math operators**.


[cordova-docs]: http://cordova.apache.org/
[phonegap-docs]: https://phonegap.com/
[phonegap-build-docs]: https://build.phonegap.com/
[cons-hybrid]: http://blog.icreon.us/launch/native-vs-hybrid-development
[camera-preview-plugin-docs]: https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview