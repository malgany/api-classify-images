# teachablemachine-node
Showing a workaround to get get teachablemachine's tf.js models running in node and beeing able to post images with json feedback
## Setup
1) Run "npm install"
2) Open "node_modules/@teachablemachine/image/dist/utils/canvas.js" and remove line 47-51 (the HTMLVideoElement check)
3) Edit app.js and add your trained moddel at line 12
4) Startup node with "node app.js"
5) Post an image (For example using the post.bat, don't forgett to change it to the correct endpoint and the right image file)
