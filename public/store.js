document.addEventListener("DOMContentLoaded", () => {
  const stripe = Stripe("pk_test_51RYCSMQ9uDBiFyIhXzLjvrOPsRUkouls9gExbGKUA20IwYflwnqiHPETA73xSxxSxblNHx8edpRA78OoYlUX7GB600zxNBUKjDY");

  const buttons = document.querySelectorAll(".buy-btn");

  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      const priceId = button.dataset.price;
      const productType = button.dataset.type;

      let size = null;

      if (productType === "shirt") {
        const sizeSelect = button.closest('.product-card').querySelector('.size-select');
        if (!sizeSelect || !sizeSelect.value) {
          alert("Please select a size before checking out.");
          return;
        }
        size = sizeSelect.value;
      }

      try {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, size })
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to create checkout session");
        }

        const data = await res.json();
        console.log("Stripe Session ID:", data.sessionId);

        if (data.sessionId) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else {
          throw new Error("No session ID returned from server.");
        }
      } catch (err) {
        console.error("Checkout error:", err);
        alert("There was a problem starting checkout.");
      }
    });
  });
});
