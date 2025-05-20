import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiHeart, FiShare2, FiMinus, FiPlus, FiTruck } from 'react-icons/fi';
import axios from 'axios';
import AddToCartButton from '../components/AddToCartButton';
import ProductReviews from '../components/ProductReviews';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            // Gọi API để lấy chi tiết sản phẩm
            const response = await axios.get(`http://localhost:8080/products/${id}`);
            const productData = response.data;
            
            // Set selected size và color mặc định
            if (productData.sizes) {
                const sizeArray = productData.sizes.split(',').map(size => size.trim());
                setSelectedSize(sizeArray[0]);
            }
            
            if (productData.color) {
                setSelectedColor(productData.color);
            }
            
            // Xử lý dữ liệu sản phẩm
            const transformedProduct = {
                id: productData.id,
                name: productData.title,
                price: productData.sellingPrice,
                originalPrice: productData.price > productData.sellingPrice ? productData.price : null,
                discount: productData.discountPercent || 0,
                rating: productData.reviews && productData.reviews.length > 0 
                    ? productData.reviews.reduce((sum, review) => sum + review.rating, 0) / productData.reviews.length 
                    : 0,
                reviewCount: productData.reviews ? productData.reviews.length : 0,
                sold: Math.floor(Math.random() * 1000) + 100, // Giả lập số lượng đã bán
                description: productData.description || 'Không có mô tả chi tiết.',
                images: productData.images && productData.images.length > 0 
                    ? productData.images 
                    : ['https://via.placeholder.com/600x400?text=No+Image'],
                sizes: productData.sizes ? productData.sizes.split(',').map(size => size.trim()) : ['M'],
                colors: [
                    { name: productData.color || 'Mặc định', value: getColorHexCode(productData.color), border: true }
                ],
                specs: [
                    { name: 'Chất liệu', value: 'Cotton' },
                    { name: 'Xuất xứ', value: 'Việt Nam' },
                    { name: 'Phù hợp', value: productData.category?.categoryId.includes('men') ? 'Nam' : 'Nữ' },
                    { name: 'Nhà cung cấp', value: productData.seller?.sellerName || 'Không xác định' }
                ],
                stock: productData.quantity || 10,
                estimatedDelivery: '3-5 ngày',
                reviews: transformReviews(productData.reviews),
                seller: productData.seller ? {
                    id: productData.seller.id,
                    name: productData.seller.sellerName,
                    businessName: productData.seller.businessDetails?.businessName
                } : null
            };
            
            setProduct(transformedProduct);
            if (transformedProduct.images && transformedProduct.images.length > 0) {
                setMainImage(transformedProduct.images[0]);
            }
            
            // Lấy sản phẩm liên quan
            fetchRelatedProducts(productData.category?.categoryId);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setLoading(false);
        }
    };
    
    // Hàm chuyển đổi tên màu thành mã hex - cập nhật thêm màu
    const getColorHexCode = (colorName) => {
        if (!colorName) return '#888888';
        
        const colorMap = {
            'Red': '#ff0000',
            'Green': '#00ff00',
            'Blue': '#0000ff',
            'Black': '#000000',
            'White': '#ffffff',
            'Gray': '#888888',
            'Orange': '#ffa500',
            'Yellow': '#ffff00',
            'Purple': '#800080',
            'Pink': '#ffc0cb',
            'Brown': '#a52a2a',
            'Teal': '#008080',
            'Đen': '#000000',
            'Trắng': '#ffffff',
            'Đỏ': '#ff0000',
            'Xanh lá': '#00ff00',
            'Xanh dương': '#0000ff',
            'Vàng': '#ffff00',
            'Cam': '#ffa500',
            'Tím': '#800080',
            'Hồng': '#ffc0cb',
            'Nâu': '#a52a2a',
            'Xám': '#888888',
            'Xanh ngọc': '#008080'
        };
        
        return colorMap[colorName] || '#888888';
    };
    
    const fetchRelatedProducts = async (categoryId) => {
        if (!categoryId) return;
        
        try {
            // Gọi API lấy sản phẩm cùng danh mục
            const response = await axios.get(`http://localhost:8080/products?category=${categoryId}&size=4`);
            const data = response.data;
            
            // Biến đổi dữ liệu
            const transformedProducts = data.content
                .filter(product => product.id !== parseInt(id)) // Loại bỏ sản phẩm hiện tại
                .slice(0, 4) // Giới hạn tối đa 4 sản phẩm
                .map(product => ({
                    id: product.id,
                    name: product.title,
                    price: product.sellingPrice,
                    originalPrice: product.price > product.sellingPrice ? product.price : null,
                    image: product.images && product.images.length > 0 ? product.images[0] : null,
                    rating: product.reviews && product.reviews.length > 0 
                        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
                        : 4.5,
                    sold: Math.floor(Math.random() * 1000) + 100
                }));
            
            setRelatedProducts(transformedProducts);
        } catch (error) {
            console.error('Error fetching related products:', error);
        }
    };
    
    // Hàm chuyển đổi reviews từ API sang định dạng hiển thị
    const transformReviews = (apiReviews) => {
        if (!apiReviews || !Array.isArray(apiReviews)) return [];
        
        return apiReviews.map(review => ({
            username: review.user?.fullName || 'Khách hàng ẩn danh',
            date: formatDate(review.createdAt),
            rating: review.rating,
            content: review.reviewText || 'Không có nội dung đánh giá.',
            images: review.productImages || []
        }));
    };
    
    // Hàm format ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const increaseQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Thêm hàm xử lý mua ngay
    const handleBuyNow = () => {
        if (!selectedSize || !selectedColor) {
            alert('Vui lòng chọn kích thước và màu sắc');
            return;
        }

        addToCart(
            {
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.images[0]
            },
            quantity,
            selectedSize,
            selectedColor
        );

        // Chuyển hướng đến trang giỏ hàng
        window.location.href = '/cart';
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-red-500">Sản phẩm không tồn tại!</h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-6">
                <ul className="flex space-x-2 text-gray-500">
                    <li><Link to="/" className="hover:text-primary">Trang chủ</Link></li>
                    <li>/</li>
                    <li><Link to="/products" className="hover:text-primary">Sản phẩm</Link></li>
                    <li>/</li>
                    <li className="text-gray-800 font-medium">{product.name}</li>
                </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product images */}
                <div>
                    {/* Main image */}
                    <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Thumbnail images */}
                    <div className="grid grid-cols-4 gap-2">
                        {product.images.map((image, index) => (
                            <div
                                key={index}
                                className={`border rounded-md overflow-hidden cursor-pointer ${mainImage === image ? 'border-primary' : 'border-gray-200'}`}
                                onClick={() => setMainImage(image)}
                            >
                                <img
                                    src={image}
                                    alt={`${product.name} - image ${index + 1}`}
                                    className="w-full h-24 object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product details */}
                <div>
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

                    {/* Product rating */}
                    <div className="flex items-center mb-4">
                        <div className="flex items-center mr-4">
                            <span className="text-lg font-semibold text-primary mr-1">{product.rating.toFixed(1)}</span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FiStar
                                        key={star}
                                        className={`${star <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        size={16}
                                    />
                                ))}
                            </div>
                        </div>
                        <span className="text-gray-500 mr-4">{product.reviewCount} đánh giá</span>
                        <span className="text-gray-500">{product.sold} đã bán</span>
                    </div>

                    {/* Product price */}
                    <div className="bg-gray-50 p-4 mb-6 rounded-md">
                        <div className="flex items-baseline">
                            <span className="text-3xl text-primary font-bold">{product.price.toLocaleString()}đ</span>
                            {product.originalPrice && (
                                <>
                                    <span className="ml-2 text-gray-400 line-through">{product.originalPrice.toLocaleString()}đ</span>
                                    <span className="ml-2 bg-primary text-white px-2 py-1 text-xs rounded-md">-{product.discount}%</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Size selection */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Kích thước</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`w-10 h-10 flex items-center justify-center border ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary'} rounded`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color selection */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Màu sắc</h3>
                        <div className="flex flex-wrap gap-3">
                            {product.colors.map((color, index) => (
                                <button
                                    key={index}
                                    className={`w-8 h-8 rounded-full ${selectedColor === color.name ? 'ring-2 ring-primary' : ''}`}
                                    style={{
                                        backgroundColor: color.value,
                                        border: color.border ? '1px solid #d1d5db' : 'none'
                                    }}
                                    onClick={() => setSelectedColor(color.name)}
                                    title={color.name}
                                ></button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Số lượng</h3>
                        <div className="flex items-center">
                            <button
                                className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-l hover:bg-gray-100"
                                onClick={decreaseQuantity}
                            >
                                <FiMinus />
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val > 0 && val <= product.stock) {
                                        setQuantity(val);
                                    }
                                }}
                                className="w-14 h-8 border-t border-b border-gray-300 text-center"
                            />
                            <button
                                className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-r hover:bg-gray-100"
                                onClick={increaseQuantity}
                            >
                                <FiPlus />
                            </button>
                            <span className="ml-4 text-gray-500">{product.stock} sản phẩm có sẵn</span>
                        </div>
                    </div>

                    {/* Add to cart and Buy now buttons */}
                    <div className="mb-6 flex space-x-4">
                        <AddToCartButton
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                image: product.images[0]
                            }}
                            quantity={quantity}
                            size={selectedSize}
                            color={selectedColor}
                            className="flex-1"
                        />
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded font-medium hover:bg-orange-700 transition"
                        >
                            Mua ngay
                        </button>
                    </div>

                    {/* Extra actions */}
                    <div className="flex space-x-6 text-gray-500 mb-8">
                        <button className="flex items-center hover:text-primary">
                            <FiHeart className="mr-1" />
                            <span>Yêu thích</span>
                        </button>
                        <button className="flex items-center hover:text-primary">
                            <FiShare2 className="mr-1" />
                            <span>Chia sẻ</span>
                        </button>
                    </div>

                    {/* Delivery info */}
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <div className="flex items-start">
                            <FiTruck className="mt-1 mr-3 text-primary" />
                            <div>
                                <h4 className="font-medium">Thời gian giao hàng</h4>
                                <p className="text-sm text-gray-600">
                                    Ước tính {product.estimatedDelivery} sau khi đặt hàng
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Product specs */}
                    <div className="border-t pt-6">
                        <h3 className="font-medium mb-3">Thông số sản phẩm</h3>
                        <table className="w-full text-sm">
                            <tbody>
                                {product.specs.map((spec, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                        <td className="py-2 px-3 font-medium">{spec.name}</td>
                                        <td className="py-2 px-3">{spec.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Product description */}
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
                <div className="text-gray-700 space-y-4">
                    <p>{product.description}</p>
                    <p>
                        Đặc điểm nổi bật:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Chất liệu cao cấp, mềm mại, thoáng mát</li>
                        <li>Form dáng thoải mái, phù hợp mọi vóc dáng</li>
                        <li>Thiết kế hiện đại, dễ phối đồ</li>
                        <li>Đường may tỉ mỉ, chắc chắn</li>
                        <li>Có nhiều size và màu sắc để lựa chọn</li>
                    </ul>
                    <p>
                        Hướng dẫn bảo quản:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Giặt máy ở nhiệt độ thấp hoặc giặt tay</li>
                        <li>Không dùng chất tẩy mạnh</li>
                        <li>Phơi trong bóng râm</li>
                        <li>Là ủi ở nhiệt độ thấp</li>
                    </ul>
                </div>
            </div>

            {/* Product reviews */}
            <ProductReviews reviews={product.reviews} />

            {/* Related products */}
            {relatedProducts.length > 0 && (
                <div className="mt-12 border-t pt-8">
                    <h2 className="text-xl font-bold mb-6">Sản phẩm tương tự</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map(relatedProduct => (
                            <ProductCard key={relatedProduct.id} product={relatedProduct} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;