import { useLocation } from "react-router-dom";
import MultipleModelViewer from "../ModelViewer/MultipleModelViewer";

const ViewModels = () => {
  const location = useLocation();
  const wishlist = location.state?.wishlist || []; // Fallback to an empty array

  return (
    <>
      {wishlist.length > 0 ? (
        <MultipleModelViewer wishlist={wishlist} />
      ) : (
        <div>No models to display in AR.</div>
      )}
    </>
  );
};

export default ViewModels;