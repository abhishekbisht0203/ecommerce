// wishlist.js
// Note: axios CSRF is set globally in quickview.js (loaded first via base.html order)
// But we also set it here as a safety measure
function _getCSRF() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}
axios.defaults.headers.common['X-CSRFToken'] = _getCSRF();

let notyf;
if (typeof Notyf !== 'undefined') {
  notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
} else {
  notyf = { success: function() {}, error: function() {} };
}

window.toggleWishlist = async function(productId) {
    console.log("wishlist clicked", productId);
    const heartIcon = document.querySelector("button[data-wishlist-id='" + productId + "'] i");
    if (!heartIcon) {
        console.warn("Heart icon not found for productId:", productId);
        return;
    }

    const isActive = heartIcon.classList.contains('text-red-500');

    try {
        if (isActive) {
            const response = await axios.post('/wishlist/remove/' + productId + '/');
            if (response.data.success) {
                heartIcon.classList.remove('text-red-500');
                updateWishlistBadge(response.data.count);
                notyf.success('Removed from wishlist');
            } else {
                throw new Error(response.data.error || 'Failed to remove');
            }
        } else {
            const response = await axios.post('/wishlist/add/' + productId + '/');
            if (response.data.success) {
                heartIcon.classList.add('text-red-500');

                if (window.animateHeartPop) {
                    window.animateHeartPop(heartIcon);
                }

                updateWishlistBadge(response.data.count);

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: '❤️ Added to Wishlist',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
            } else {
                throw new Error(response.data.error || 'Failed to add');
            }
        }
    } catch (err) {
        console.error('Wishlist error:', err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'Could not update wishlist',
        });
    }
};

function updateWishlistBadge(count) {
    const badge = document.getElementById("wishlist-badge");
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
}
