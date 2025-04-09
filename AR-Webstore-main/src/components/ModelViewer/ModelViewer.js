import React, { useRef, useState, useEffect } from "react";
import LazyLoad from "react-lazyload";
// import "../../Products/ProductList.css";
import QRCode from "qrcode.react";
import Help from "./Help";
const ModelViewer = ({ item, addToWishlist, removeFromWishlist, wishlist }) => {
  const [selectedVariant, setSelectedVariant] = useState('default');
  const [display, setDisplay] = useState(false);
  const [ARSupported, setARSupported] = useState(false);
  const [annotate, setAnnotate] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [collisionDetected, setCollisionDetected] = useState(false);
  
  
  let modelViewer1 = {
    backgroundColor: " #ecf0f3",
    overflowX: "hidden",
    posterColor: "#eee",
    width: "100%",
    height: ARSupported ? "85%" : "75%",
    borderRadius: 15,
  };
  
  // Accessing product for full screen start
  const model = useRef();

  // Accessing varient selections element
  const varient = useRef(null);

  const collisionTimeout = useRef(null);

  console.log(item)

  function toggle() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  // Full screen code end


  const handleAnnotateClick = (annotation) => {
    const modelViewer = model.current;
    if (modelViewer) {
      modelViewer.cameraOrbit = annotation.orbit;
      modelViewer.cameraTarget = annotation.target;
    }
  }

  useEffect(() => {
    if (model.current) {
      const modelViewer = model.current;
      
      // Check if AR is supported
      if (modelViewer.canActivateAR) {
        setARSupported(true);
      }

      // Add collision detection
      modelViewer.addEventListener('ar-status', (event) => {
        if (event.detail.status === 'session-started') {
          // Start collision detection when AR session starts
          modelViewer.addEventListener('ar-tracking', (trackingEvent) => {
            if (trackingEvent.detail.status === 'tracking') {
              // Check for collisions with other AR objects
              const arObjects = document.querySelectorAll('model-viewer[ar]');
              arObjects.forEach((otherObject) => {
                if (otherObject !== modelViewer) {
                  const distance = calculateDistance(modelViewer, otherObject);
                  if (distance < 0.5) { // 0.5 meters threshold
                    handleCollision();
                  }
                }
              });
            }
          });
        }
      });
    }
  }, []);

  const calculateDistance = (obj1, obj2) => {
    const pos1 = obj1.getAttribute('position');
    const pos2 = obj2.getAttribute('position');
    if (!pos1 || !pos2) return Infinity;

    const [x1, y1, z1] = pos1.split(' ').map(Number);
    const [x2, y2, z2] = pos2.split(' ').map(Number);

    return Math.sqrt(
      Math.pow(x2 - x1, 2) + 
      Math.pow(y2 - y1, 2) + 
      Math.pow(z2 - z1, 2)
    );
  };

  const handleCollision = () => {
    setCollisionDetected(true);
    
    // Clear previous timeout
    if (collisionTimeout.current) {
      clearTimeout(collisionTimeout.current);
    }

    // Add visual feedback
    const modelViewer = model.current;
    if (modelViewer) {
      modelViewer.style.border = '2px solid red';
      modelViewer.style.transition = 'border-color 0.3s ease';
    }

    // Reset after 2 seconds
    collisionTimeout.current = setTimeout(() => {
      setCollisionDetected(false);
      if (modelViewer) {
        modelViewer.style.border = 'none';
      }
    }, 2000);
  };

  useEffect(() => {
    // set up event listeners
    const modelViewer = model.current
    modelViewer &&
    modelViewer.addEventListener('load', () => {
      console.log('loaded')
      const availableVariants = modelViewer?.availableVariants;
      console.log(availableVariants)
      for (const variant of availableVariants) {
        const option = document.createElement('option');
        option.value = variant;
        option.textContent = variant;
        varient?.current?.appendChild(option);
      }

      // Adding a default option
      const defaultOption = document.createElement('option');
      defaultOption.value = 'Default';
      defaultOption.textContent = 'Default';
      varient?.current?.appendChild(defaultOption);
    });

    varient?.current?.addEventListener('input', (event) => {
      modelViewer.variantName = event.target.value === 'Default' ? null : event.target.value;
    });
  }, []);
   
  useEffect(() => {
    if(wishlist){
    const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item.id);
    setIsInWishlist(isInWishlist);
    }
  }, [item, wishlist]);
  const handleAddToWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(item.id);
    } 
    else 
    {
      addToWishlist(item);
    }
  };

  return (
    <div className="model-view">
      <model-viewer
        key={item.id}
        ref={model}
        style={modelViewer1}
        src={item.modelSrc}
        ios-src={item.iOSSrc}
        alt="A 3D model"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate

      >

        {ARSupported && (
          <button slot="ar-button" className="arbutton">
            View in your space
          </button>
        )}

        <button className="fullscreen-btn" onClick={toggle}>
          &#x26F6;<span>full screen</span>
        </button>
        {display ? (
          <>
            <button
              className={document.fullscreenElement ? "close fz" : "close"}
              onClick={() => setDisplay(false)}
            >
              &#10006;
            </button>
            <Help />
          </>
        ) : (
          <>
            <button className="help-btn" onClick={() => setDisplay(true)}>
              ?<span>help</span>
            </button>
          </>
        )}
        
        <button className="annotate-btn" onClick={() => setAnnotate((prevState) => !prevState)}>
          i
        </button>

        {annotate && item.annotations.map((annotate, idx) => (
          <button
            key={idx}
            class="Hotspot"
            slot={annotate.slot}
            data-position={annotate.position}
            data-normal={annotate.normal}
            data-orbit={annotate.orbit}
            data-target={annotate.target}
            data-visibility-attribute="visible"
            onClick={() => handleAnnotateClick(annotate)}
          >
            <div class="HotspotAnnotation">{annotate.title}</div>
          </button>
        ))}
        
        <div class="controls variant_div">
          <select ref={varient} id="variant"></select>
        </div>

      </model-viewer>
        
      <LazyLoad>
        {/* Card content below the model-viewer */}
        <div className="qr-sec">
          {!ARSupported && (
            <QRCode
              id={item.name}
              value={`https://3cc9-128-185-112-61.ngrok-free.app/?ar=true&model=${item.id}`}
              size={110}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin
            />
          )}

          <div className="product-details">
            <div>
              <div className="pname">{item.name}</div>
              <div className="rating-sec">
                <div>Rating</div>
                <div>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span>&#9733;</span>
                  <span>&#9733;</span>
                </div>
              </div>
              <div>Rs. 1000</div>
              {!ARSupported && <h5>Scan the QR code to view {item.name} in AR on your mobile device</h5>}
              {collisionDetected && <div className="collision-warning">⚠️ Collision detected!</div>}
            </div>
            {addToWishlist && removeFromWishlist && (
              <button className="add-icon" onClick={handleAddToWishlist}>
                {isInWishlist ? '-' : '+'}
              </button>
            )}
          </div>
        </div>
      </LazyLoad>
    </div>
  );
};

export default ModelViewer;