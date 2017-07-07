## Tutorial
http://blog.mathocr.com/2017/06/09/beautiful-camera-preview-with-cordova.html

## Installation
1. Install nodejs:  
https://nodejs.org/en/download/  
... or alternatively via package manager(**linux**):  
`sudo apt-get install -y nodejs`

2. Install cordova:  
`npm install -g cordova`

3. Create a project. Name it whatever you want:  
`cordova create <project_dir_name> <project_address> <project_display_name>`  
**Example**: `cordova create hello com.example.hello HelloWorld`

4. Navigate to newly created project and **replace _www_ directory** with the one provided with this repo.

4. **Add platforms** before you run emulator/build:  
`cordova platform add android`  
`cordova platform add ios`  
`cordova platform add browser`  
**Note**: To check all platforms available run:
`cordova platform`

## Project structure
**_hooks_**, **_node_modules_**, **_platforms_**, **_plugins_**,  **_res_** are generated automatically.  

**_config.xml_** contains application description like its title, autor email, app store description, etc.  

The only folder to modify is **_www_**.

## Usage
1. Navigate to **project's root folder**.  

2. Build native app & run it on mobile device:  
`cordova run android|ios|browser`  
... or serve files on a localhost:  
`cordova serve`

## Results
![screenshot](https://user-images.githubusercontent.com/22115481/27963916-c4c395aa-6336-11e7-90a4-ea54eb3d14c4.jpg)
