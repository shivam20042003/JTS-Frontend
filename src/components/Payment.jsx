import React, { useState } from 'react';

const CreateOrderWithPayment = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 500, currency: 'INR' }), // Example: ₹500
      });

      const order = await orderResponse.json();

      if (!order.id) {
        throw new Error('Unable to create Razorpay order');
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: 'RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: 'Jain Tiffin Shala',
        description: 'Order Payment',
        order_id: order.id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verificationResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verification = await verificationResponse.json();

            if (verification.success) {
              setPaymentSuccess(true);
              alert('Payment Successful! Order Created.');
            } else {
              alert('Payment Verification Failed!');
            }
          } catch (error) {
            alert('Error verifying payment: ' + error.message);
          }
        },
        prefill: {
          name: 'Customer Name', // Optional
          email: 'customer@example.com', // Optional
          contact: '9999999999', // Optional
        },
        theme: {
          color: '#f58220', // Optional: Brand color
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      alert('Payment Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Place Your Order</h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`px-6 py-3 rounded-lg font-semibold text-white ${
          loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        {loading ? 'Processing...' : 'Pay ₹500'}
      </button>
      {paymentSuccess && <p className="text-green-500 mt-4">Order has been created successfully!</p>}
    </div>
  );
};

export default CreateOrderWithPayment;