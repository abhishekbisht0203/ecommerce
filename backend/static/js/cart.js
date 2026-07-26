// cart.js
function _getCSRFCart() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}
axios.defaults.headers.common['X-CSRFToken'] = _getCSRFCart();

window.addToCart = async function(productId) {
    console.log("cart clicked", productId);
    try {
        const response = await axios.post('/addtocart/' + productId + '/');
        if (response.data && response.data.success) {
            // Update cart badge instantly
            const badge = document.getElementById("cart-badge");
            if (badge && response.data.cart_count != null) {
                badge.textContent = response.data.cart_count;
            }

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: '🛒 Added to Cart!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            throw new Error((response.data && response.data.error) || 'Failed to add to cart');
        }
    } catch (err) {
        console.error('Cart error:', err);
        // Handle 302 redirect (user not logged in)
        if (err.response && err.response.status === 302) {
            window.location.href = '/login/';
            return;
        }
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'Could not add to cart',
        });
    }
};
