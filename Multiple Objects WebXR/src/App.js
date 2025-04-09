// import "./App.css";
// import * as THREE from "three";
// import { ARButton } from "three/examples/jsm/webxr/ARButton";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight";

// function App() {
//   let reticle;
//   let hitTestSource = null;
//   let hitTestSourceRequested = false;

//   let scene, camera, renderer;

//   let models = [
//     "./sheenchair.glb",
//     "./OfficeChair.glb",
//     "./pot.glb",
//     "./Painting.glb",
//     "./chair.glb",
//     "./night_stand_lamp.glb"
//   ];
//   let modelScaleFactor = [0.5, 0.5, 0.15, 0.5, 0.5, 0.5];
//   let items = [];
//   let itemSelectedIndex = 0;

//   let controller;

//   init();
//   setupFurnitureSelection();
//   animate();

//   function init() {
//     let myCanvas = document.getElementById("canvas");
//     scene = new THREE.Scene();
//     camera = new THREE.PerspectiveCamera(
//       70,
//       myCanvas.innerWidth / myCanvas.innerHeight,
//       0.01,
//       20
//     );

//     const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
//     light.position.set(0.5, 1, 0.25);
//     scene.add(light);

//     renderer = new THREE.WebGLRenderer({
//       canvas: myCanvas,
//       antialias: true,
//       alpha: true,
//     });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(myCanvas.innerWidth, myCanvas.innerHeight);
//     renderer.xr.enabled = true;

//     // Don't add the XREstimatedLight to the scene initially
//     // It doesn't have any estimated lighting values until an AR session starts
//     const xrLight = new XREstimatedLight(renderer);
//     xrLight.addEventListener("estimationstart", () => {
//       // Swap the default light out for the estimated one so we start getting some estimated values.
//       scene.add(xrLight);
//       scene.remove(light);
//       // The estimated lighting also provides an env cubemap which we apply here
//       if (xrLight.environment) {
//         scene.environment = xrLight.environment;
//       }
//     });

//     xrLight.addEventListener("estimationend", () => {
//       // Swap the lights back when we stop receiving estimated values
//       scene.add(light);
//       scene.remove(xrLight);

//       // Revert back to the default environment
//       // scene.environment =
//     });

//     let arButton = ARButton.createButton(renderer, {
//       requiredFeatures: ["hit-test"],
//       optionalFeatures: ["dom-overlay", "light-estimation"],
//       domOverlay: { root: document.body },
//     });
//     arButton.style.bottom = "20%";
//     document.body.appendChild(arButton);

//     for (let i = 0; i < models.length; i++) {
//       const loader = new GLTFLoader();
//       loader.load(models[i], function (glb) {
//         let model = glb.scene;
//         items[i] = model;
//       });
//     }

//     controller = renderer.xr.getController(0);
//     controller.addEventListener("select", onSelect);
//     scene.add(controller);

//     reticle = new THREE.Mesh(
//       new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
//       new THREE.MeshBasicMaterial()
//     );
//     reticle.matrixAutoUpdate = false;
//     reticle.visible = false;
//     scene.add(reticle);
//   }

//   function onSelect() {
//     if (reticle.visible) {
//       let newModel = items[itemSelectedIndex].clone();
//       newModel.visible = true;
//       // this one will set the position but not the rotation
//       // newModel.position.setFromMatrixPosition(reticle.matrix);

//       // this will set the position and the rotation to face you
//       reticle.matrix.decompose(
//         newModel.position,
//         newModel.quaternion,
//         newModel.scale
//       );
//       let scaleFactor = modelScaleFactor[itemSelectedIndex];
//       newModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

//       scene.add(newModel);
//     }
//   }

//   const onClicked = (e, selectItem, index) => {
//     itemSelectedIndex = index;

//     // remove image selection from others to indicate unclicked
//     for (let i = 0; i < models.length; i++) {
//       const el = document.querySelector(`#item` + i);
//       el.classList.remove("clicked");
//     }
//     // set image to selected
//     e.target.classList.add("clicked");
//   };

//   function setupFurnitureSelection() {
//     for (let i = 0; i < models.length; i++) {
//       const el = document.querySelector(`#item` + i);
//       el.addEventListener("beforexrselect", (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//       });
//       el.addEventListener("click", (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         onClicked(e, items[i], i);
//       });
//     }
//   }

//   function animate() {
//     renderer.setAnimationLoop(render);
//   }

//   function render(timestamp, frame) {
//     if (frame) {
//       const referenceSpace = renderer.xr.getReferenceSpace();
//       const session = renderer.xr.getSession();

//       if (hitTestSourceRequested === false) {
//         session.requestReferenceSpace("viewer").then(function (referenceSpace) {
//           session
//             .requestHitTestSource({ space: referenceSpace })
//             .then(function (source) {
//               hitTestSource = source;
//             });
//         });

//         session.addEventListener("end", function () {
//           hitTestSourceRequested = false;
//           hitTestSource = null;
//         });

//         hitTestSourceRequested = true;
//       }

//       if (hitTestSource) {
//         const hitTestResults = frame.getHitTestResults(hitTestSource);

//         if (hitTestResults.length) {
//           const hit = hitTestResults[0];

//           reticle.visible = true;
//           reticle.matrix.fromArray(
//             hit.getPose(referenceSpace).transform.matrix
//           );
//         } else {
//           reticle.visible = false;
//         }
//       }
//     }

//     renderer.render(scene, camera);
//   }

//   return <div className="App"></div>;
// }

// export default App;


import "./App.css";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight";

function App() {
  // Global scene and state variables
  let reticle, hitTestSource = null, hitTestSourceRequested = false;
  let scene, camera, renderer;
  const models = [
    "./sheenchair.glb",
    "./OfficeChair.glb",
    "./pot.glb",
    "./Painting.glb",
    "./chair.glb",
    "./night_stand_lamp.glb"
  ];
  const modelScaleFactor = [0.5, 0.5, 0.15, 0.5, 0.5, 0.5];
  const items = [];             // Loaded models
  const placedObjects = [];     // All objects added to scene
  let itemSelectedIndex = 0;      // Which model to place
  let selectedObject = null;      // Object picked for manipulation
  
  // For pointer (drag) events:
  let isDragging = false;
  let previousPointerPos = new THREE.Vector2();
  
  // For multi-touch scaling/rotation:
  let initialTouchDistance = 0;
  let initialTouchAngle = 0;
  let initialScale = new THREE.Vector3();
  let initialRotationY = 0;
  
  let controller;
  
  // Initialization – create scene and AR button, load models, etc.
  init();
  setupFurnitureSelection();
  animate();
  
  function init() {
    // Use the renderer's DOM element (which is our canvas)
    const canvas = document.getElementById("canvas");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      70,
      canvas.clientWidth / canvas.clientHeight,
      0.01,
      20
    );
  
    // Default hemispherical light
    const defaultLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    defaultLight.position.set(0.5, 1, 0.25);
    scene.add(defaultLight);
  
    // Renderer configuration with AR settings
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.xr.enabled = true;
  
    // Use XREstimatedLight to get more realistic lighting in AR.
    const xrLight = new XREstimatedLight(renderer);
    xrLight.addEventListener("estimationstart", () => {
      scene.add(xrLight);
      scene.remove(defaultLight);
      if (xrLight.environment) {
        scene.environment = xrLight.environment;
      }
    });
    xrLight.addEventListener("estimationend", () => {
      scene.add(defaultLight);
      scene.remove(xrLight);
    });
  
    // Create the AR button with hit-test enabled
    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["dom-overlay", "light-estimation"],
      domOverlay: { root: document.body }
    });
    arButton.style.bottom = "20%";
    document.body.appendChild(arButton);
  
    // Load 3D models using GLTFLoader – store them in our array
    models.forEach((modelURL, index) => {
      const loader = new GLTFLoader();
      loader.load(modelURL, (glb) => {
        let model = glb.scene;
        // Hide the model until it’s placed in the scene.
        model.visible = false;
        items[index] = model;
      });
    });
  
    // Create a controller for AR select event (to place objects)
    controller = renderer.xr.getController(0);
    controller.addEventListener("select", onSelect);
    scene.add(controller);
  
    // Create the reticle from a RingGeometry.
    reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
  
    // --- Interactivity: Attach event listeners to the renderer's DOM element ---
    // Using renderer.domElement ensures events are received in AR sessions.
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    // Multi-touch events for scaling/rotation:
    renderer.domElement.addEventListener("touchstart", onTouchStart, false);
    renderer.domElement.addEventListener("touchmove", onTouchMove, false);
    renderer.domElement.addEventListener("touchend", onTouchEnd, false);
  }
  
  // When the AR controller "select" is triggered, place the current model.
  function onSelect() {
    if (reticle.visible && items[itemSelectedIndex]) {
      const newModel = items[itemSelectedIndex].clone();
      newModel.visible = true;
      // Set the object's position/rotation from the reticle’s transform.
      reticle.matrix.decompose(newModel.position, newModel.quaternion, newModel.scale);
      // Apply a predefined scale factor.
      const scaleFactor = modelScaleFactor[itemSelectedIndex];
      newModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
      scene.add(newModel);
      placedObjects.push(newModel);
      // Automatically mark the new object as active.
      selectedObject = newModel;
    }
  }
  
  //  --- Pointer events for object selection and drag (translation) ---
  
  function onPointerDown(event) {
    event.preventDefault();
    const pointer = new THREE.Vector2();
    // Convert the pointer position to normalized device coordinates.
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // Create a raycaster.
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);
    // Check intersections among all placed objects.
    const intersects = raycaster.intersectObjects(placedObjects, true);
    if (intersects.length > 0) {
      // If hit, we assume the top-level object is the one we want.
      selectedObject = intersects[0].object.parent || intersects[0].object;
      isDragging = true;
      previousPointerPos.set(event.clientX, event.clientY);
    } else {
      // If nothing is hit, clear the selection.
      selectedObject = null;
      isDragging = false;
    }
  }
  
  function onPointerMove(event) {
    if (!isDragging || !selectedObject) return;
    // Calculate how far the pointer moved.
    const dx = event.clientX - previousPointerPos.x;
    const dy = event.clientY - previousPointerPos.y;
    // Adjust the object's X and Z coordinates.
    // (Note: these multipliers may need tweaking based on your scene scale.)
    selectedObject.position.x += dx * 0.001;
    selectedObject.position.z += dy * 0.001;
    previousPointerPos.set(event.clientX, event.clientY);
  }
  
  function onPointerUp(event) {
    isDragging = false;
  }
  
  // --- Touch Events for Two-Finger Scaling and Rotation ---
  
  function onTouchStart(event) {
    if (event.touches.length === 2 && selectedObject) {
      initialTouchDistance = getDistance(event.touches[0], event.touches[1]);
      initialTouchAngle = getAngle(event.touches[0], event.touches[1]);
      initialScale.copy(selectedObject.scale);
      initialRotationY = selectedObject.rotation.y;
    }
  }
  
  function onTouchMove(event) {
    if (event.touches.length === 2 && selectedObject && initialTouchDistance) {
      const currentDistance = getDistance(event.touches[0], event.touches[1]);
      const currentAngle = getAngle(event.touches[0], event.touches[1]);
      // Scaling: compute the scale factor.
      const scaleFactor = currentDistance / initialTouchDistance;
      selectedObject.scale.set(
        initialScale.x * scaleFactor,
        initialScale.y * scaleFactor,
        initialScale.z * scaleFactor
      );
      // Rotation: compute the difference in angle.
      const angleDiff = currentAngle - initialTouchAngle;
      selectedObject.rotation.y = initialRotationY + angleDiff;
    }
  }
  
  function onTouchEnd(event) {
    // When fewer than two touches remain, reset the values.
    if (event.touches.length < 2) {
      initialTouchDistance = 0;
      initialTouchAngle = 0;
    }
  }
  
  function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  function getAngle(touch1, touch2) {
    return Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    );
  }
  
  // --- Furniture Selection UI ---
  // This sets up click events on thumbnails (assumes DOM elements with ids "item0", "item1", …)
  function setupFurnitureSelection() {
    for (let i = 0; i < models.length; i++) {
      const el = document.querySelector(`#item${i}`);
      if (el) {
        // Block AR controller interference on the UI.
        el.addEventListener("beforexrselect", (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
        el.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Set the current model index
          itemSelectedIndex = i;
          // Mark this thumbnail as selected
          for (let j = 0; j < models.length; j++) {
            const itemEl = document.querySelector(`#item${j}`);
            if (itemEl) itemEl.classList.remove("clicked");
          }
          e.target.classList.add("clicked");
        });
      }
    }
  }
  
  // --- Render Loop and Hit-Test Management ---
  
  function animate() {
    renderer.setAnimationLoop(render);
  }
  
  function render(timestamp, frame) {
    if (frame) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      const session = renderer.xr.getSession();
      if (!hitTestSourceRequested) {
        session
          .requestReferenceSpace("viewer")
          .then((refSpace) => {
            session.requestHitTestSource({ space: refSpace })
            .then((source) => {
              hitTestSource = source;
            });
          });
        session.addEventListener("end", () => {
          hitTestSourceRequested = false;
          hitTestSource = null;
        });
        hitTestSourceRequested = true;
      }
  
      if (hitTestSource) {
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length) {
          const hit = hitTestResults[0];
          reticle.visible = true;
          reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
        } else {
          reticle.visible = false;
        }
      }
    }
    renderer.render(scene, camera);
  }
  
  // UI: We return our canvas along with a simple thumbnail panel.
  return (
    <div className="App">
      <canvas id="canvas" style={{ width: "100vw", height: "100vh" }} />
      <div id="furnitureSelection">
        {models.map((_, index) => (
          <img
            key={index}
            id={`item${index}`}
            src={`thumbnail${index}.jpg`}
            alt={`Furniture item ${index}`}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
