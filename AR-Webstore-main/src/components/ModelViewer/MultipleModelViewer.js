// import React, { useEffect, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { ARButton } from "three/examples/jsm/webxr/ARButton";

// export default function MultipleModelViewer({ wishlist }) {
//   const [scene, setScene] = useState(null);
//   const [renderer, setRenderer] = useState(null);
//   const [camera, setCamera] = useState(null);
//   const [models, setModels] = useState([]);

//   useEffect(() => {
//     init();
//   }, []);

//   useEffect(() => {
//     if (scene && wishlist.length > 0) {
//       loadWishlistModels(wishlist);
//     }
//   }, [scene, wishlist]);

//   function init() {
//     // Scene & Camera
//     const newScene = new THREE.Scene();
//     const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     newCamera.position.set(0, 1.6, 3);

//     // Renderer
//     const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     newRenderer.setSize(window.innerWidth, window.innerHeight);
//     newRenderer.xr.enabled = true;
//     document.body.appendChild(newRenderer.domElement);

//     // WebXR Button
//     document.body.appendChild(
//         ARButton.createButton(newRenderer, {
//           requiredFeatures: ["hit-test"],  // Ensure hit-test is enabled
//           optionalFeatures: ["dom-overlay"],  // Allows UI overlay in AR
//           mode: "immersive-ar",  // Force AR mode (prevents Cardboard VR)
//         })
//     );

//     // Lighting
//     const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
//     newScene.add(light);

//     // Save scene, camera, and renderer in state
//     setScene(newScene);
//     setCamera(newCamera);
//     setRenderer(newRenderer);

//     // Resize Handling
//     window.addEventListener("resize", onWindowResize(newCamera, newRenderer));

//     // Animation Loop
//     newRenderer.setAnimationLoop(() => animate(newRenderer, newScene, newCamera));
//   }

//     // Pointer Events for Model Manipulation
//     let selectedModel = null;
//     const raycaster = new THREE.Raycaster();
//     const pointer = new THREE.Vector2();

//     let isDragging = false;
//     let prevTouch = { x: 0, y: 0 };

//     function onPointerDown(event) {
//         if (!camera || !scene) return;

//         pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//         pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

//         raycaster.setFromCamera(pointer, camera);
//         const intersects = raycaster.intersectObjects(scene.children, true);

//         if (intersects.length > 0) {
//             let object = intersects[0].object;

//             // Traverse up to the parent model
//             while (object.parent && object.parent !== scene) {
//             object = object.parent;
//             }

//             selectedModel = object;
//             isDragging = true;
//             prevTouch = { x: event.clientX, y: event.clientY };
//         }
//     }

//     function onPointerMove(event) {
//         if (!selectedModel || !isDragging) return;
      
//         const deltaX = (event.clientX - prevTouch.x) * 0.005; // Adjust sensitivity
//         const deltaY = (event.clientY - prevTouch.y) * 0.005;
      
//         selectedModel.position.x += deltaX;
//         selectedModel.position.y -= deltaY; // Invert Y-axis movement
      
//         prevTouch = { x: event.clientX, y: event.clientY };
//     }

//     function onPointerUp() {
//         isDragging = false;
//     }

//     // Attach event listeners
//     window.addEventListener("pointerdown", onPointerDown);
//     window.addEventListener("pointermove", onPointerMove);
//     window.addEventListener("pointerup", onPointerUp);

//   function loadWishlistModels(wishlistItems) {
//     if (!scene) return; // Ensure scene is initialized
    
//     const loader = new GLTFLoader();
//     let newModels = [];
  
//     wishlistItems.forEach((item, index) => {
//       if (!item || !item.modelSrc) {
//         console.error("Invalid modelPath:", item); 
//         return; // Skip undefined or incorrect paths
//       }

//     const modelGroup = new THREE.Group();
//     scene.add(modelGroup);
  
//       loader.load(
//         item.modelSrc,
//         (gltf) => {
//           const model = gltf.scene;
//           modelGroup.add(model);
//           model.position.set(index * 2 - wishlistItems.length, 0, -3);
//           scene.add(model);
//           newModels.push(model);
//           setModels([...models, model]);
//         },
//         undefined,
//         (error) => console.error("Error loading model:", item.modelPath, error)
//       );
//     });
//   }
  

//   function animate(renderer, scene, camera) {
//     models.forEach((model) => {
//       model.rotation.y += 0.01;
//     });
//     renderer.render(scene, camera);
//   }

//   function onWindowResize(camera, renderer) {
//     return function () {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//   }

//   function rotateModel(direction) {
//     if (selectedModel) {
//       selectedModel.rotation.y += direction === "left" ? 0.1 : -0.1;
//     }
//   }

//   return <></>; // Component doesn't render anything, it initializes WebXR
// }







// import React, { useEffect, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { ARButton } from "three/examples/jsm/webxr/ARButton";

// export default function MultipleModelViewer({ wishlist }) {
//   const [scene, setScene] = useState(null);
//   const [renderer, setRenderer] = useState(null);
//   const [camera, setCamera] = useState(null);
//   const [models, setModels] = useState([]);
//   let selectedModel = null;
//   let isDragging = false;
//   let prevTouch = { x: 0, y: 0 };
//   let isScaling = false;
//   let initialDistance = 0;

//   useEffect(() => {
//     init();
//   }, []);

//   useEffect(() => {
//     if (scene && wishlist.length > 0) {
//       loadWishlistModels(wishlist);
//     }
//   }, [scene, wishlist]);

//   function init() {
//     const newScene = new THREE.Scene();
//     const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     newCamera.position.set(0, 1.6, 3);

//     const newRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     newRenderer.setSize(window.innerWidth, window.innerHeight);
//     newRenderer.xr.enabled = true;
//     document.body.appendChild(newRenderer.domElement);
//     document.body.appendChild(ARButton.createButton(newRenderer));

//     const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
//     newScene.add(light);

//     setScene(newScene);
//     setCamera(newCamera);
//     setRenderer(newRenderer);

//     window.addEventListener("resize", onWindowResize(newCamera, newRenderer));
//     newRenderer.setAnimationLoop(() => animate(newRenderer, newScene, newCamera));
//   }

//   function loadWishlistModels(wishlistItems) {
//     if (!scene) return;
//     const loader = new GLTFLoader();
//     let newModels = [];

//     wishlistItems.forEach((item, index) => {
//       if (!item || !item.modelSrc) return;
//       loader.load(item.modelSrc, (gltf) => {
//         const model = gltf.scene;
//         model.position.set(index * 2 - wishlistItems.length, 0, -3);
//         model.traverse((child) => {
//           if (child.isMesh) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//           }
//         });
//         scene.add(model);
//         newModels.push(model);
//         setModels((prev) => [...prev, model]);
//       });
//     });
//   }

//   function onPointerDown(event) {
//     if (!camera || !scene) return;
//     const raycaster = new THREE.Raycaster();
//     const pointer = new THREE.Vector2();

//     pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//     pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     raycaster.setFromCamera(pointer, camera);
//     const intersects = raycaster.intersectObjects(scene.children, true);

//     if (intersects.length > 0) {
//       let object = intersects[0].object;
//       while (object.parent && object.parent !== scene) {
//         object = object.parent;
//       }
//       selectedModel = object;
//       isDragging = true;
//       prevTouch = { x: event.clientX, y: event.clientY };
//     }
//   }

//   function onPointerMove(event) {
//     if (!selectedModel || !isDragging) return;
//     const deltaX = (event.clientX - prevTouch.x) * 0.005;
//     const deltaY = (event.clientY - prevTouch.y) * 0.005;
//     selectedModel.position.x += deltaX;
//     selectedModel.position.y -= deltaY;
//     prevTouch = { x: event.clientX, y: event.clientY };
//   }

//   function onPointerUp() {
//     isDragging = false;
//   }

//   function onTouchStart(event) {
//     if (event.touches.length === 2) {
//       isScaling = true;
//       initialDistance = getTouchDistance(event.touches);
//     }
//   }

//   function onTouchMove(event) {
//     if (isScaling && event.touches.length === 2) {
//       let newDistance = getTouchDistance(event.touches);
//       let scaleFactor = newDistance / initialDistance;
//       if (selectedModel) {
//         selectedModel.scale.setScalar(selectedModel.scale.x * scaleFactor);
//       }
//       initialDistance = newDistance;
//     }
//   }

//   function onTouchEnd() {
//     isScaling = false;
//   }

//   function getTouchDistance(touches) {
//     const dx = touches[0].clientX - touches[1].clientX;
//     const dy = touches[0].clientY - touches[1].clientY;
//     return Math.sqrt(dx * dx + dy * dy);
//   }

//   function animate(renderer, scene, camera) {
//     models.forEach((model) => {
//       model.rotation.y += 0.01;
//     });
//     renderer.render(scene, camera);
//   }

//   function onWindowResize(camera, renderer) {
//     return function () {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//   }

//   window.addEventListener("pointerdown", onPointerDown);
//   window.addEventListener("pointermove", onPointerMove);
//   window.addEventListener("pointerup", onPointerUp);
//   window.addEventListener("touchstart", onTouchStart);
//   window.addEventListener("touchmove", onTouchMove);
//   window.addEventListener("touchend", onTouchEnd);

//   return <></>;
// }

import React, { useEffect } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function MultipleModelViewer({ wishlist }) {
  let reticle;
  let hitTestSource = null;
  let hitTestSourceRequested = false;

  let scene, camera, renderer;

  let items = [];
  let itemSelectedIndex = 0;

  useEffect(() => {
    init();
    animate();
  }, []);

  function init() {
    // Initialize scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);

    // Add ARButton
    let arButton = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["dom-overlay", "light-estimation"],
      domOverlay: { root: document.body },
    });
    document.body.appendChild(arButton);

    // Load models from wishlist
    const loader = new GLTFLoader();
    wishlist.forEach((item, index) => {
      loader.load(item.modelSrc, (gltf) => {
        let model = gltf.scene;
        items[index] = model;
      });
    });

    // Add reticle
    reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    // Add controller for AR interactions
    const controller = renderer.xr.getController(0);
    controller.addEventListener("select", onSelect);
    scene.add(controller);

    // Handle window resize
    window.addEventListener("resize", onWindowResize);
  }

  function onSelect() {
    if (reticle.visible) {
      let newModel = items[itemSelectedIndex].clone();
      newModel.visible = true;

      // Set position and rotation based on reticle
      reticle.matrix.decompose(
        newModel.position,
        newModel.quaternion,
        newModel.scale
      );

      // Scale the model (adjust as needed)
      newModel.scale.set(0.01, 0.01, 0.01);

      scene.add(newModel);
    }
  }

  function animate() {
    renderer.setAnimationLoop(render);
  }

  function render(timestamp, frame) {
    if (frame) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      const session = renderer.xr.getSession();

      if (!hitTestSourceRequested) {
        session.requestReferenceSpace("viewer").then((viewerSpace) => {
          session
            .requestHitTestSource({ space: viewerSpace })
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

        if (hitTestResults.length > 0) {
          const hit = hitTestResults[0];
          reticle.visible = true;
          reticle.matrix.fromArray(
            hit.getPose(referenceSpace).transform.matrix
          );
        } else {
          reticle.visible = false;
        }
      }
    }

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  return <></>;
}