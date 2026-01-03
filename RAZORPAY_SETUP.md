# Razorpay Integration Setup Guide

## Prerequisites
1. Create a Razorpay account at https://razorpay.com
2. Complete KYC verification (required for live mode)

## Configuration Steps

### 1. Get Your API Keys

**Test Mode (for development):**
1. Login to Razorpay Dashboard
2. Navigate to Settings → API Keys
3. Click "Generate Test Key"
4. Copy the Key ID (starts with `rzp_test_`)

**Live Mode (for production):**
1. Complete KYC verification
2. Navigate to Settings → API Keys  
3. Click "Generate Live Key"
4. Copy the Key ID (starts with `rzp_live_`)

### 2. Update the Code

Open `app/routes/checkout.tsx` and replace the key in the Razorpay options:

```typescript
const options = {
  key: "rzp_test_YOUR_KEY_ID", // Replace with your actual key
  // ... rest of the options
};
```

**Important:** 
- Use test key (`rzp_test_`) during development
- Use live key (`rzp_live_`) in production
- Never commit API keys to version control
- Consider using environment variables for production

### 3. Test Payment Methods

Razorpay supports the following payment methods:

**UPI:**
- Google Pay
- PhonePe
- Paytm
- BHIM
- Other UPI apps

**Cards:**
- Credit Cards (Visa, Mastercard, Amex, RuPay)
- Debit Cards (all major banks)

**Net Banking:**
- All major Indian banks
- HDFC, ICICI, SBI, Axis, etc.

**Wallets:**
- Paytm
- PhonePe
- Amazon Pay
- Freecharge

### 4. Test Cards (Test Mode Only)

Use these test card details in test mode:

**Successful Payment:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI ID:**
- success@razorpay
- failure@razorpay

### 5. Webhook Setup (Optional)

For production, set up webhooks to handle payment confirmations:

1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
3. Select events: `payment.authorized`, `payment.failed`
4. Copy the webhook secret

### 6. Currency Conversion

The current implementation uses a fixed conversion rate (1 USD = 83 INR). For production:

1. Use a real-time currency API (e.g., exchangerate-api.io)
2. Or display prices in INR only
3. Update the conversion logic in `checkout.tsx`

### 7. Security Best Practices

1. **Verify Payment Signatures:** Always verify Razorpay signatures on the backend
2. **Use HTTPS:** Ensure your site uses HTTPS in production
3. **Secure API Keys:** Never expose keys in client-side code
4. **Implement Backend Validation:** Verify payments on your server
5. **Handle Webhooks:** Process webhook events for reliable payment tracking

### 8. Go Live Checklist

- [ ] Complete Razorpay KYC
- [ ] Replace test key with live key
- [ ] Test all payment methods
- [ ] Set up webhooks
- [ ] Implement backend verification
- [ ] Add proper error handling
- [ ] Test on multiple devices
- [ ] Review transaction fees
- [ ] Set up settlement account

## Support

- Razorpay Documentation: https://razorpay.com/docs/
- Test Mode Guide: https://razorpay.com/docs/payments/payments/test-card-details/
- API Reference: https://razorpay.com/docs/api/

## Need Help?

Contact Razorpay Support:
- Email: support@razorpay.com
- Phone: +91 76697 61999
