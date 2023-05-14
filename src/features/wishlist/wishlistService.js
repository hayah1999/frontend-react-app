import axios from "axios";

const url = 'http://127.0.0.1:8000/user/wishlist/';

const addToWishlist = async (productId, token) => {
    const config = {
        headers: {
            Authorization: `token ${token}`,
        },
    };
    const response = await axios.post(url + 'add/' + productId , {}, config);
    return response.data;
};
const removeWishlist = async (productId, token) => {
    const config = {
        headers: {
            Authorization: `token ${token}`,
        },
    };
    const response = await axios.delete(url + productId , config);
    return response.data;
};


const wishlistService = {
    addToWishlist,
    removeWishlist
}

export default wishlistService