import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router";
import { CreditCard, Truck, ShieldCheck, Smartphone } from "lucide-react";
import type { Route } from "./+types/checkout";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { RazorpayTestNotice } from "~/components/razorpay-test-notice";
import { useCart } from "~/hooks/use-cart";
import { Input } from "~/components/ui/input/input";
import { Label } from "~/components/ui/label/label";
import { createOrder } from "~/services/orders.service";
import { getSiteSettings } from "~/services/site-settings.service";
import styles from "./checkout.module.css";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export async function loader() {
  const siteSettings = await getSiteSettings();
  return { siteSettings };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout - Lumière" },
    {
      name: "description",
      content: "Complete your order securely.",
    },
  ];
}

export default function Checkout() {
  const { siteSettings } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { items: cartItems, getTotalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  useEffect(() => {
    // Check if this is a buy-now checkout
    const buyNowItemStr = localStorage.getItem("buyNowItem");
    if (buyNowItemStr) {
      try {
        const buyNowItem = JSON.parse(buyNowItemStr);
        setItems([buyNowItem]);
        setIsBuyNow(true);
      } catch (error) {
        console.error("Error parsing buy-now item:", error);
        navigate("/cart");
      }
    } else {
      // Use cart items
      setItems(cartItems);
      setIsBuyNow(false);
    }
  }, [cartItems, navigate]);

  const cartItemCount = getTotalItems();
  
  const totalPrice = items.reduce(
    (total, item) => total + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );
  const shippingCost = totalPrice >= 16600 ? 0 : 1245;
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + shippingCost + tax;
  const grandTotalPaise = grandTotal * 100; // Convert to paise

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentSuccess = async (response: any, localOrderId: string) => {
    try {
      // Create order in database
      const orderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zip}, ${formData.country}`,
        total_amount: grandTotal,
        payment_status: 'completed',
        order_status: 'pending',
      };

      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price,
      }));

      const order = await createOrder(orderData, orderItems);

      // Store order details for confirmation page
      const confirmationData = {
        orderId: order.id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        items: items.map(item => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            discountPrice: item.product.discountPrice,
            image: item.product.image,
          },
          quantity: item.quantity,
        })),
        totalPrice,
        shippingCost,
        tax,
        grandTotal,
        paymentMethod: "razorpay",
        date: new Date().toISOString(),
      };

      localStorage.setItem("lastOrder", JSON.stringify(confirmationData));

      // Clear cart or buy-now item
      if (isBuyNow) {
        localStorage.removeItem("buyNowItem");
      } else {
        clearCart();
      }

      // Navigate to confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Order was paid but there was an error saving it. Please contact support.');
      setIsProcessing(false);
    }
  };

  const handlePaymentFailure = (error: any) => {
    setIsProcessing(false);
    alert(`Payment failed: ${error.error?.description || "Please try again"}`);    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      setIsProcessing(false);
      return;
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}`;

    // Initialize Razorpay payment
    const options = {
      key: "rzp_test_Rz8qoauDcMNwBw", // Razorpay API key
      amount: grandTotalPaise, // Amount in paise
      currency: "INR",
      name: "Lumière",
      description: "Order Payment",
      order_id: orderId,
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      theme: {
        color: "#000000",
      },
      handler: function (response: any) {
        handlePaymentSuccess(response, orderId);
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", handlePaymentFailure);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      alert("Payment gateway error. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className={styles.container}>
      <Header 
        cartItemCount={cartItemCount}
        brandName={siteSettings?.brand_name}
        logoUrl={siteSettings?.logo_url || undefined}
        announcementText={siteSettings?.announcement_text || undefined}
        announcementBehavior={siteSettings?.announcement_behavior}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>Checkout</h1>
        
        <RazorpayTestNotice />

        <div className={styles.checkoutLayout}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Truck className={styles.sectionIcon} />
                Shipping Information
              </h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.formGroupFull}>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="zip">PIN Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    placeholder="400001"
                    value={formData.zip}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleFormChange}
                    readOnly
                  />
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <CreditCard className={styles.sectionIcon} />
                Payment via Razorpay
              </h2>
              
              <div className={styles.razorpayInfo}>
                <div className={styles.razorpayBadge}>
                  <img
                    src="https://razorpay.com/assets/razorpay-glyph.svg"
                    alt="Razorpay"
                    className={styles.razorpayLogo}
                  />
                  <span>Secure Payment Gateway</span>
                </div>
                
                <div className={styles.paymentOptions}>
                  <div className={styles.paymentOption}>
                    <Smartphone className={styles.paymentOptionIcon} />
                    <div>
                      <strong>UPI</strong>
                      <p>Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  
                  <div className={styles.paymentOption}>
                    <CreditCard className={styles.paymentOptionIcon} />
                    <div>
                      <strong>Cards</strong>
                      <p>Credit & Debit Cards</p>
                    </div>
                  </div>
                  
                  <div className={styles.paymentOption}>
                    <svg className={styles.paymentOptionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="2" />
                      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                    </svg>
                    <div>
                      <strong>Net Banking</strong>
                      <p>All major banks supported</p>
                    </div>
                  </div>
                </div>
                
                <p className={styles.razorpayNote}>
                  You will be redirected to Razorpay's secure checkout page to complete your payment.
                </p>
              </div>
            </section>

            <div className={styles.trustBadges}>
              <div className={styles.trustBadge}>
                <ShieldCheck className={styles.trustIcon} />
                <span>Secure Checkout</span>
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={isProcessing}>
              {isProcessing ? "Opening Razorpay..." : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
            </button>
          </form>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.summaryItem}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={styles.summaryItemImage}
                  />
                  <div className={styles.summaryItemDetails}>
                    <p className={styles.summaryItemName}>{item.product.name}</p>
                    <p className={styles.summaryItemQty}>Qty: {item.quantity}</p>
                  </div>
                  <p className={styles.summaryItemPrice}>
                    ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      <Footer 
        brandName={siteSettings?.brand_name}
        contactEmail={siteSettings?.contact_email || undefined}
        contactPhone={siteSettings?.contact_phone || undefined}
        socialLinks={siteSettings?.social_links}
      />
    </div>
  );
}
