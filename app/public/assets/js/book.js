$(document).ready(function () {
  // Initialize Materialize modals
  $(".modal").modal();

  // Add to Cart
  $(".cart-button").on("click", function (event) {
    event.preventDefault();

    const bookId = Number($(this).attr("value"));
    const quantity = 1; // default quantity

    if (!bookId) return alert("Book ID not found!");

    // POST to /api/cart/add
    $.ajax({
      url: "/api/cart/add",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ bookId, quantity }),
    })
      .done(function (data) {
        console.log("✅ Added to cart:", data);
        // Reload page or update cart count dynamically
        location.reload();
      })
      .fail(function (xhr, status, error) {
        console.error("❌ Failed to add to cart:", xhr.responseJSON || error);
        alert("Failed to add to cart");
      });
  });

  // Checkout (clear cart)
  $(".checkout-button").on("click", function () {
    $.ajax({
      url: "/api/cart/delete",
      type: "DELETE",
    })
      .done(function () {
        console.log("✅ Cart cleared");
        location.reload();
      })
      .fail(function (xhr, status, error) {
        console.error("❌ Failed to clear cart:", xhr.responseJSON || error);
        alert("Failed to clear cart");
      });
  });
});


