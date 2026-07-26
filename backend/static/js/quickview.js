// quickview.js

// Helper: get Django CSRF token from cookie for axios POST requests
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Set CSRF token on all axios POST requests globally
axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');

window.quickView = async function(productId) {
    console.log("quick view clicked", productId);
    try {
        // URL matches urls.py: path('quickview/<int:product_id>/', ...)
        const response = await axios.get('/quickview/' + productId + '/');
        const product = response.data;

        const imageUrl = product.image_url || product.image || '';
        const html =
            '<div style="text-align:center; padding: 8px;">' +
            (imageUrl ? '<img src="' + imageUrl + '" alt="' + product.name + '" style="width:220px;height:220px;object-fit:contain;margin:0 auto 16px;border-radius:8px;display:block;" />' : '') +
            '<h2 style="font-size:1.4rem;font-weight:700;margin-bottom:8px;color:#1a2b4c;">' + product.name + '</h2>' +
            '<p style="color:#6b7280;margin-bottom:12px;">' + (product.description || '') + '</p>' +
            '<p style="font-size:1.25rem;font-weight:700;color:#2563eb;margin-bottom:20px;">₹' + product.price + '</p>' +
            '<button style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:999px;font-weight:600;border:none;cursor:pointer;font-size:1rem;" onclick="Swal.close(); addToCart(' + product.id + ')">🛒 Add to Cart</button>' +
            '</div>';

        Swal.fire({
            html: html,
            showCloseButton: true,
            showConfirmButton: false,
            width: '420px',
            background: '#ffffff',
            padding: '1.5em',
            customClass: { popup: 'rounded-2xl' }
        });
    } catch (error) {
        console.error('Quick view error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Unable to load product',
            text: 'Please try again later.',
        });
    }
};
