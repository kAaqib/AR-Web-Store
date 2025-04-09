import "./App.css";
// import "@google/model-viewer/dist/model-viewer.min.js";
import { Routes, Route, BrowserRouter, useSearchParams } from "react-router-dom";
import ProductList from "./components/ProductList/ProductList";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/Signin";
import WishList from "./components/Wishlist/WishList";
import ViewModels from "./components/Wishlist/ViewModels";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import ModelViewer from "./components/ModelViewer/ModelViewer";
import MultipleModelViewer from "./components/ModelViewer/MultipleModelViewer";
import productItems from "./data/ProductItems";
import '@google/model-viewer';


const AppContent = () => {
  const [wishlist, setWishlist] = useState([]);
  const [searchParams] = useSearchParams();
  const arMode = searchParams.get('ar') === 'true';
  const modelId = searchParams.get('model');

  const addToWishlist = (item) => {
    setWishlist([...wishlist, item]);
  };
  const handleRemoveItem = (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(updatedWishlist);
  };

  useEffect(() => {
    if (arMode && modelId) {
      const product = productItems.find(item => item.id === parseInt(modelId));
      if (product) {
        // Force AR mode
        const modelViewer = document.querySelector('model-viewer');
        if (modelViewer) {
          modelViewer.activateAR();
        }
      }
    }
  }, [arMode, modelId]);

  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            arMode && modelId ? (
              <div className="ar-container">
                <ModelViewer 
                  item={productItems.find(item => item.id === parseInt(modelId))}
                  addToWishlist={addToWishlist}
                  removeFromWishlist={handleRemoveItem}
                  wishlist={wishlist}
                />
              </div>
            ) : (
              <ProductList
                addToWishlist={addToWishlist}
                wishlist={wishlist}
                removeFromWishlist={handleRemoveItem}
              />
            )
          }
        />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/wishlist"
          element={
            <WishList wishlist={wishlist} onRemoveItem={handleRemoveItem} />
          }
        />
        <Route path="/view-models" element={<ViewModels wishlist={wishlist} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
