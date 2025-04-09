# AR-Web-Store

AR-Web-Store is a web-based augmented reality experience that lets users browse a virtual furniture catalog, place 3D models into their real-world environment, and interact with them through intuitive gestures—all within a modern web browser using WebXR and Three.js.

## Overview

AR-Web-Store empowers users to experience products in augmented reality before purchasing. It uses advanced WebXR features to detect surfaces, accurately place 3D furniture models, and allow object manipulation such as translation, scaling, and rotation. This repository demonstrates an end-to-end AR experience and serves as a starting point for developing a robust AR web store.

## Features

- **AR Model Placement:**  
  Utilize AR hit testing and a reticle to precisely position models in your physical space.

- **Interactive Object Manipulation:**  
  Once an object is placed, interact with it by tapping to select, dragging to move, and using pinch gestures to scale and rotate.

- **Simple Furniture Catalog UI:**  
  Choose from a set of models via a thumbnail-based UI to decide which item to place in the scene.

- **Realistic Lighting with XREstimatedLight:**  
  Use WebXR light estimation for more natural lighting effects on 3D models.

## Technologies Used

- **Three.js:**  
  For 3D scene creation and model rendering.

- **WebXR API:**  
  Provides immersive AR sessions in compatible browsers and devices.

- **React:**  
  Organizes the application into modular components, managing both the AR scene and UI interactions.

- **GLTFLoader:**  
  Loads GLB models into the Three.js scene.

## Installation and Build

### Clone the Repository

```bash
git clone https://github.com/kAaqib/AR-Web-Store.git
```

### Install Dependencies
Each app is a separate React project. You’ll need to install dependencies in each folder. For example:

```bash
cd AR-Webstore-main
npm install
cd ../"Multiple Objects WebXR"
npm install
cd ..
```

### Build the Apps
At the root of each app, run the build command:

```bash
cd AR-Webstore-main
npm run build
cd ../"Multiple Objects WebXR"
npm run build
cd ..
```

### Running the Apps
The server.js file in the root directory is used to serve the built apps on their respective ports. Make sure the builds are up-to-date before running the server.

Start the Server
At the root of the repository, run:

```bash
node server.js
```

The server will serve each app on its designated port. For example:

AR-Webstore-main: might be served on https://your_ipv4_address:443

Multiple Objects WebXR: might be served on http://your_ipv4_address:444

(Verify the port assignments in server.js for exact details.)

## Mobile Access

To access the AR-Web-Store from your mobile device, make sure your mobile phone is connected to the same Wi-Fi or local network as your laptop. Once connected, simply open the mobile browser and enter your laptop’s IPv4 address along with the appropriate port. For example:

The AR-Webstore-main is served on port 443, access it via:
https://<your_laptop_ipv4_address>:443

The Multiple Objects WebXR is served on port 444, access it via:
http://<your_laptop_ipv4_address>:444

This enables you to test the AR experience on your mobile device using its camera and sensors for immersive AR functionality.

## About the Apps

### AR-Webstore-main:
An augmented reality web store experience that allows users to browse furniture products, place 3D models into their environment, and interact (select, move, scale, and rotate) with them in AR.

### Multiple Objects WebXR:
A demonstration of placing and interacting with multiple 3D objects in an AR environment. This app is focused on managing several objects simultaneously within an AR scene.

## Contributing
Contributions to either app are welcome. Please follow these guidelines:

Fork the repository.

Create a branch for your feature or bug fix.

Submit a pull request with a clear description of your changes.

## Acknowledgements
### Three.js & WebXR:
This project uses Three.js and the WebXR API to bring augmented reality into the browser.

### React:
Each app is built using React to manage the AR UI and interactions.

### Open Source Community:
Thanks to everyone contributing to open source AR projects and libraries.
