// import React from "react";
// import "./WishList.css";
// import {Link} from 'react-router-dom';
// const WishList = ({wishlist,onRemoveItem}) => {
//   const isEmpty =wishlist.length===0;

//   const EmptyCart = () => {
//     return (
//       <>
//         <div className="alert">
//           You have no items in your WishList, start adding some!
//         </div>
//         <Link to="/" className="button go-back">
//           Go Back
//         </Link>
//       </>
//     );
//   };
//   const handleRemoveItem = (id) => {
//     onRemoveItem(id);
//   };
//   const FilledWishList = () => {
//     return (
//       <div className="wishlist-items">
//         {wishlist.map((item) => (
//           <div key={item.id} className="wishlist-item">
//             <div className="wishlist-details">
//               <div className="wishlist-name">{item.name}</div>
//               <div className="wishlist-category">Category: {item.category}</div>
//               <div className="wishlist-color">Color: {item.color}</div>
//             </div>
//             <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>
//     );
//   };
//   return (
//     <div className="container">
//       <h3 className="cart-title">Your WishList</h3>
//       <div className="cart-grid">
//         <div className="cart-items-container">
//           <div className="cart-paper">
//             <h5 className="cart-heading">Added Items</h5>
//             <hr className="divider" />
//             {isEmpty ? <EmptyCart /> : <FilledWishList />}
//           </div>
//         </div>
//         </div>
//       </div>
//   );
// };

// export default WishList;

// import React, { useState } from "react";
// import "./WishList.css";
// import MultipleModelViewer from "../ModelViewer/MultipleModelViewer";
// import { Link } from "react-router-dom";

// const WishList = ({ wishlist, onRemoveItem }) => {

//   const [items, setItems] = useState([]);

//   const [viewInAR, setViewInAR] = useState(false);

//   const handleRemoveItem = (id) => {
//     onRemoveItem(id);
//   };

//   const EmptyCart = () => (
//     <>
//       <div className="alert">
//         You have no items in your WishList, start adding some!
//       </div>
//       <Link to="/" className="button go-back">
//         Go Back
//       </Link>
//     </>
//   );

//   const FilledWishList = () => (
//     <div className="wishlist-items">
//       {wishlist.map((item) => (
//         <div key={item.id} className="wishlist-item">
//           <div className="wishlist-details">
//             <div className="wishlist-name">{item.name}</div>
//             <div className="wishlist-category">Category: {item.category}</div>
//             <div className="wishlist-color">Color: {item.color}</div>
//           </div>
//           <button
//             onClick={() => handleRemoveItem(item.id)}
//             className="remove-btn"
//           >
//             Remove
//           </button>
//         </div>
//       ))}
//     </div>
//   );

  
//   return (
//     <div className="container">
//       <h3 className="cart-title">Your WishList</h3>
//       <div className="cart-grid">
//         <div className="cart-items-container">
//           <div className="cart-paper">
//             <h5 className="cart-heading">Added Items</h5>
//             <hr className="divider" />
//             {wishlist.length === 0 ? <EmptyCart /> : <FilledWishList />}
//           </div>
//         </div>
//       </div>
//       {wishlist.length > 0 && (
//         <button
//           className="view-ar-btn"
//           onClick={() => setViewInAR(!viewInAR)}
//         >
//           {viewInAR ? "Hide AR View" : "View All in AR"}
//         </button>
//       )}
//       {viewInAR && <MultipleModelViewer wishlist={wishlist} />}
//     </div>
//   );
// };

// export default WishList;

























import React, { useState } from "react";
import "./WishList.css";
import MultipleModelViewer from "../ModelViewer/MultipleModelViewer";
import { Link } from "react-router-dom";

const WishList = ({ wishlist, onRemoveItem }) => {
  const [viewInAR, setViewInAR] = useState(false);
  const [showBlankPage, setShowBlankPage] = useState(false);

  const handleRemoveItem = (id) => {
    onRemoveItem(id);
  };

  const hideBlankPage = () => {
    setShowBlankPage(false); // Hide the blank page
  };

  const EmptyCart = () => (
    <>
      <div className="alert">
        You have no items in your WishList, start adding some!
      </div>
      <Link to="/" className="button go-back">
        Go Back
      </Link>
    </>
  );

  const FilledWishList = () => (
    <div className="wishlist-items">
      {wishlist.map((item) => (
        <div key={item.id} className="wishlist-item">
          <div className="wishlist-details">
            <div className="wishlist-name">{item.name}</div>
            <div className="wishlist-category">Category: {item.category}</div>
            <div className="wishlist-color">Color: {item.color}</div>
          </div>
          <button
            onClick={() => handleRemoveItem(item.id)}
            className="remove-btn"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="container">
        <h3 className="cart-title">Your WishList</h3>
        <div className="cart-grid">
          <div className="cart-items-container">
            <div className="cart-paper">
              <h5 className="cart-heading">Added Items</h5>
              <hr className="divider" />
              {wishlist.length === 0 ? <EmptyCart /> : <FilledWishList />}
            </div>
          </div>
        </div>
        {wishlist.length > 0 && (
          // <MultipleModelViewer wishlist={wishlist} />
          // <Link to="/view-models" state={{ wishlist }} className="button go-back">
          //   View All in AR
          // </Link>
          <button
            className="button go-back"
            onClick={() => {
              window.location.href = "https://192.168.162.240:444";
              // viewInAR ? setViewInAR(false) : setViewInAR(true);
            }}
          >
            {viewInAR ? "Hide AR View" : "View All in AR"}
          </button>
        )}
        {viewInAR && <MultipleModelViewer wishlist={wishlist} />}
      </div>
    </>
  );
};

export default WishList;