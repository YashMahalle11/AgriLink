
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";


const ProductDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    );
    const { user, guestId } = useSelector((state) => state.auth);
    const [mainImage, setMainImage] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const productFetchId = productId || id;

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts(productFetchId));
        }
    }, [dispatch, productFetchId]);

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        if (!selectedOption && selectedProduct.productOptions.length > 0) {
            toast.error(`Please select an option before adding to cart.`, { duration: 1000 });
            return;
        }

        setIsButtonDisabled(true);

        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                selectedOption,
                guestId,
                userId: user?._id,
            })
        )
            .then(() => {
                toast.success("Product added to cart!", { duration: 1000 });
            })
            .finally(() => {
                setIsButtonDisabled(false);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-6">
            {selectedProduct && (
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                    <div className="flex flex-col md:flex-row">
                        <div className="hidden md:flex flex-col space-y-4 mr-6">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url || null}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                                        mainImage === image.url ? "border-black" : "border-gray-300"
                                    }`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>

                        {mainImage && (
                            <div className="md:w-1/2">
                                <div className="mb-4">
                                    <img
                                        src={mainImage}
                                        alt="Main Product"
                                        className="w-full h-auto object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url || null}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                                        mainImage === image.url ? "border-black" : "border-gray-300"
                                    }`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>

                        <div className="md:w-1/2 md:ml-10">
                            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                                {selectedProduct.name}
                            </h1>

                            {selectedProduct.discountPrice && (
                                <p className="text-lg text-gray-600 mb-1 line-through">
                                    ₹{selectedProduct.discountPrice}
                                </p>
                            )}
                            <p className="text-xl text-gray-500 mb-2">₹{selectedProduct.price}</p>
                            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

                            {/* Dynamic Option Selection */}
                            {selectedProduct.productOptions.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-gray-700">{selectedProduct.productOptionLabel}:</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedProduct.productOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => setSelectedOption(option)}
                                                className={`px-4 py-2 rounded border ${
                                                    selectedOption === option ? "bg-gray-500 text-white" : ""
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <p className="text-gray-700">Quantity:</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <button
                                        onClick={() => handleQuantityChange("minus")}
                                        className="px-2 py-1 bg-gray-200 rounded text-lg"
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange("plus")}
                                        className="px-2 py-1 bg-gray-200 rounded text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                                    isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"
                                }`}
                            >
                                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                            </button>

                            <div className="mt-10 text-gray-700">
                                <h3 className="text-xl font-bold mb-4">Product Details:</h3>
                                <table className="w-full text-left text-sm text-gray-600">
                                    <tbody>
                                        <tr>
                                            <td className="py-1">Category</td>
                                            <td className="py-1">{selectedProduct.category}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Type</td>
                                            <td className="py-1">{selectedProduct.type}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Freshness</td>
                                            <td className="py-1">{selectedProduct.freshness}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Unit</td>
                                            <td className="py-1">{selectedProduct.unit}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Brand</td>
                                            <td className="py-1">{selectedProduct.brand?.join(", ")}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20">
                        <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
                        <ProductGrid products={similarProducts} loading={loading} error={error} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;





/*import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    );
    const { user, guestId } = useSelector((state) => state.auth);
    const [mainImage, setMainImage] = useState(null); // Changed from "" to null
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const productFetchId = productId || id;

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts(productFetchId));
        }
    }, [dispatch, productFetchId]);

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        if (!selectedColor && selectedProduct.colors.length > 0) {
            toast.error("Please select a color before adding to cart.", { duration: 1000 });
            return;
        }

        setIsButtonDisabled(true);

        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                color: selectedColor,
                guestId,
                userId: user?._id,
            })
        )
            .then(() => {
                toast.success("Product added to cart!", {
                    duration: 1000,
                });
            })
            .finally(() => {
                setIsButtonDisabled(false);
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="p-6">
            {selectedProduct && (
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                    <div className="flex flex-col md:flex-row">
                        {/* Left Thumbnails */ //}
     /*                   <div className="hidden md:flex flex-col space-y-4 mr-6">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url || null} // Fallback to null if url is empty
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                                        mainImage === image.url ? "border-black" : "border-gray-300"
                                    }`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>

                        {/* Main Image - Only render if mainImage exists */ //}
  /*                      {mainImage && (
                            <div className="md:w-1/2">
                                <div className="mb-4">
                                    <img
                                        src={mainImage}
                                        alt="Main Product"
                                        className="w-full h-auto object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Mobile Thumbnails */ //}
      /*                  <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url || null} // Fallback to null if url is empty
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                                        mainImage === image.url ? "border-black" : "border-gray-300"
                                    }`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>

                        {/* Right Side */ //}
   /*                     <div className="md:w-1/2 md:ml-10">
                            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                                {selectedProduct.name}
                            </h1>

                            {selectedProduct.discountPrice && (
                                <p className="text-lg text-gray-600 mb-1 line-through">
                                    ₹{selectedProduct.discountPrice}
                                </p>
                            )}
                            <p className="text-xl text-gray-500 mb-2">₹{selectedProduct.price}</p>
                            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

                            {/* Color Selection */ //}
 /*                           {selectedProduct.colors.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-gray-700">Select Color:</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedProduct.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 rounded border ${
                                                    selectedColor === color ? "bg-gray-500 text-white" : ""
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selection */ //}
    /*                        <div className="mb-6">
                                <p className="text-gray-700">Quantity:</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <button
                                        onClick={() => handleQuantityChange("minus")}
                                        className="px-2 py-1 bg-gray-200 rounded text-lg"
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange("plus")}
                                        className="px-2 py-1 bg-gray-200 rounded text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */ //}
  /*                          <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                                    isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"
                                }`}
                            >
                                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                            </button>

                            {/* Product Details Table */ //}
   /*                         <div className="mt-10 text-gray-700">
                                <h3 className="text-xl font-bold mb-4">Product Details:</h3>
                                <table className="w-full text-left text-sm text-gray-600">
                                    <tbody>
                                        <tr>
                                            <td className="py-1">Category</td>
                                            <td className="py-1">{selectedProduct.category}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Type</td>
                                            <td className="py-1">{selectedProduct.type}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Freshness</td>
                                            <td className="py-1">{selectedProduct.freshness}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Similar Products */ //}
     /*               <div className="mt-20">
                        <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
                        <ProductGrid products={similarProducts} loading={loading} error={error} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails; */
















/*import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    );
    const { user, guestId } = useSelector((state) => state.auth);
    const [mainImage, setMainImage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const productFetchId = productId || id;

    /*useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({ id: productFetchId }));
        }
    }, [dispatch, productFetchId]); */
  /*  useEffect(() => {
        if (productFetchId) {
          dispatch(fetchProductDetails(productFetchId));
          dispatch(fetchSimilarProducts(productFetchId)); // Changed from passing an object to just the ID
        }
      }, [dispatch, productFetchId]);

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        if (!selectedColor && selectedProduct.colors.length > 0) {
            toast.error("Please select a color before adding to cart.", { duration: 1000 });
            return;
        }

        setIsButtonDisabled(true);

        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                color: selectedColor,
                guestId,
                userId: user?._id,
            })
        )
            .then(() => {
                toast.success("Product added to cart!", {
                    duration: 1000,
                });
            })
            .finally(() => {
                setIsButtonDisabled(false);
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="p-6">
            {selectedProduct && (
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                    <div className="flex flex-col md:flex-row">
                        {/* Left Thumbnails */ //}
 /*                       <div className="hidden md:flex flex-col space-y-4 mr-6">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                                        mainImage === image.url ? "border-black" : "border-gray-300"
                                    }`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>

                        {/* Main Image */ //}
 /*                       <div className="md:w-1/2">
                            <div className="mb-4">
                                <img
                                    src={mainImage}
                                    alt="Main Product"
                                    className="w-full h-auto object-cover rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Mobile Thumbnails */ //}
  /*                      <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                            {selectedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                                        mainImage === image.url ? "border-black" : "border-gray-300"
                                    }`}
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>

                        {/* Right Side */ //}
  /*                      <div className="md:w-1/2 md:ml-10">
                            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                                {selectedProduct.name}
                            </h1>

                            <p className="text-lg text-gray-600 mb-1 line-through">
                                {selectedProduct.discountPrice && `₹${selectedProduct.discountPrice}`}
                            </p>
                            <p className="text-xl text-gray-500 mb-2">₹{selectedProduct.price}</p>
                            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

                            {/* Color Selection */ //}
  /*                          {selectedProduct.colors.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-gray-700">Select Color:</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedProduct.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 rounded border ${
                                                    selectedColor === color ? "bg-gray-500 text-white" : ""
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selection *///}
 /*                           <div className="mb-6">
                                <p className="text-gray-700">Quantity:</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <button
                                        onClick={() => handleQuantityChange("minus")}
                                        className="px-2 py-1 bg-gray-200 rounded text-lg"
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange("plus")}
                                        className="px-2 py-1 bg-gray-200 rounded text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */ //}
 /*                           <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                                    isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"
                                }`}
                            >
                                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                            </button>

                            {/* Product Details Table */ //}
   /*                         <div className="mt-10 text-gray-700">
                                <h3 className="text-xl font-bold mb-4">Product Details:</h3>
                                <table className="w-full text-left text-sm text-gray-600">
                                    <tbody>
                                        <tr>
                                            <td className="py-1">Category</td>
                                            <td className="py-1">{selectedProduct.category}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Type</td>
                                            <td className="py-1">{selectedProduct.type}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Freshness</td>
                                            <td className="py-1">{selectedProduct.freshness}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Similar Products */ //}
 /*                   <div className="mt-20">
                        <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
                        <ProductGrid products={similarProducts} loading={loading} error={error} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;

/*import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice';
import { addToCart } from '../../redux/slices/cartSlice';



const ProductDetails = ({productId}) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    );
    const { user, guestId } = useSelector((state) => state.auth);
    const [mainImage, setMainImage] = useState("");
    const [selectedFreshness, setSelectedFreshness] = useState("");
    const [selectedOrigin, setSelectedOrigin] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const productFetchId = productId || id;

    useEffect(() => {
    if(productFetchId){
        dispatch(fetchProductDetails(productFetchId));
        dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
    }, [dispatch, productFetchId]);



    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        if (!selectedFreshness || !selectedOrigin) {
            toast.error("Please select freshness and origin before adding to cart.", { duration: 1000 });
            return;
        }

        setIsButtonDisabled(true);

       dispatch(
        addToCart({
            productId: productFetchId,
            quantity,
            size: selectedSize,
            color: selectedColor,
            guestId,
            userId: user?._id,
        })
       ).then(() => {
        toast.success("Product added to cart!",{
            duration:1000,
        });
       })
       .finally(() => {
        setIsButtonDisabled(false);
       });
    };

    if (loading){
        return <p>Loading...</p>;
    }

    if (error){
        return <p>Error: {error}</p>;
    }



    return (
        <div className='p-6'>
            {selectedProduct && (
            <div className='max-w-6xl mx-auto bg-white p-8 rounded-lg'>
                <div className='flex flex-col md:flex-row'>
                    {/* Left Thumbnails */  //}
  /*                   <div className='hidden md:flex flex-col space-y-4 mr-6'>
                        {selectedProduct.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.altText || `Thumbnail ${index}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                                onClick={() => setMainImage(image.url)}
                            />
                        ))}
                    </div>

                    {/* Main Image */ // }
 /*                   <div className='md:w-1/2'>
                        <div className='mb-4'>
                            <img src={mainImage} alt='Main Product' className='w-full h-auto object-cover rounded-lg' />
                        </div>
                    </div>

                    {/* Mobile Thumbnail */  //}
 /*                <div className='md:hidden flex overscroll-x-scroll space-x-4 mb-4'>
                        {selectedProduct.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.altText || `Thumbnail ${index}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                                onClick={() => setMainImage(image.url)}
                            />
                        ))}
                    </div>

                    {/* Right Side *///}
  /*                  <div className='md:w-1/2 md:ml-10'>
                        <h1 className='text-2xl md:text-3xl font-semibold mb-2'>
                            {selectedProduct.name}
                        </h1>

                        <p className='text-lg text-gray-600 mb-1 line-through'>
                            {selectedProduct.originalPrice && `₹${selectedProduct.originalPrice}`}
                        </p>
                        <p className='text-xl text-gray-500 mb-2'>
                            ₹{selectedProduct.price}
                        </p>
                        <p className='text-gray-600 mb-4'>
                            {selectedProduct.description}
                        </p>

                        {/* Freshness Selection */// }
  /*                      <div className='mb-4'>
                            <p className='text-gray-700'>Freshness:</p>
                            <div className='flex gap-2 mt-2'>
                                {selectedProduct.freshness.map((fresh) => (
                                    <button
                                        key={fresh}
                                        onClick={() => setSelectedFreshness(fresh)}
                                        className={`px-4 py-2 rounded border ${selectedFreshness === fresh ? "bg-green-500 text-white" : ""}`}
                                    >
                                        {fresh}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Origin Selection */// }
 /*                      <div className='mb-4'>
                            <p className='text-gray-700'>Origin:</p>
                            <div className='flex gap-2 mt-2'>
                                {selectedProduct.origin.map((org) => (
                                    <button
                                        key={org}
                                        onClick={() => setSelectedOrigin(org)}
                                        className={`px-4 py-2 rounded border ${selectedOrigin === org ? "bg-blue-500 text-white" : ""}`}
                                    >
                                        {org}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selection */ //}
 /*                      <div className='mb-6'>
                            <p className='text-gray-700'>Quantity:</p>
                            <div className='flex items-center space-x-4 mt-2'>
                                <button onClick={() => handleQuantityChange("minus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange("plus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */ //}
/*                       <button
                            onClick={handleAddToCart}
                            disabled={isButtonDisabled}
                            className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"}`}
                        >
                            {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                        </button>

                        {/* Characteristics Table */ //}
 /*                      <div className='mt-10 text-gray-700'>
                            <h3 className='text-xl font-bold mb-4'>Product Details:</h3>
                            <table className='w-full text-left text-sm text-gray-600'>
                                <tbody>
                                    <tr>
                                        <td className='py-1'>Category</td>
                                        <td className='py-1'>{selectedProduct.category}</td>
                                    </tr>
                                    <tr>
                                        <td className='py-1'>Brand</td>
                                        <td className='py-1'>{selectedProduct.brand}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Similar Products */ //}
 /*                <div className='mt-20'>
                    <h2 className="text-2xl text-center font-medium mb-4">
                        You May Also Like
                    </h2>
                    <ProductGrid products={similarProducts} loading={loading} error={error}/>
                </div>
           </div>
         )} 
      </div>
   );
};

export default ProductDetails; */
