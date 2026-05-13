const axios = require('axios');

class Instamojo {
  constructor() {
    this.apiKey = process.env.INSTAMOJO_API_KEY;
    this.authToken = process.env.INSTAMOJO_AUTH_TOKEN;
    this.isSandbox = process.env.INSTAMOJO_IS_SANDBOX === 'true';
    
    this.baseUrl = this.isSandbox 
      ? 'https://test.instamojo.com/api/1.1' 
      : 'https://www.instamojo.com/api/1.1';
    
    console.log(`🔧 Instamojo Initialized: ${this.isSandbox ? 'SANDBOX' : 'LIVE'} mode`);
    console.log(`🔧 API Key Presence: ${this.apiKey ? 'YES' : 'NO'}`);
    console.log(`🔧 Auth Token Presence: ${this.authToken ? 'YES' : 'NO'}`);
  }

  async createPaymentRequest({ amount, purpose, buyerName, email, phone, redirectUrl }) {
    const data = new URLSearchParams();
    data.append('amount', amount);
    data.append('purpose', purpose);
    data.append('buyer_name', buyerName);
    data.append('email', email);
    // Ensure phone is valid for Instamojo (no placeholders)
    const sanitizedPhone = (phone && !phone.includes('google_pending')) ? phone : '9999999999';

    data.append('phone', sanitizedPhone);
    data.append('redirect_url', redirectUrl);
    data.append('send_email', 'true');
    data.append('webhook', `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`);
    data.append('allow_repeated_payments', 'false');

    try {
      console.log(`💳 [V1] Creating payment request at: ${this.baseUrl}/payment-requests/`);
      const response = await axios.post(`${this.baseUrl}/payment-requests/`, data, {
        headers: {
          'X-Api-Key': this.apiKey,
          'X-Auth-Token': this.authToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return {
        id: response.data.payment_request.id,
        longurl: response.data.payment_request.longurl
      };
    } catch (error) {
      if (error.response) {
        console.error('Instamojo V1 API Error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Instamojo Network Error:', error.message);
      }
      throw new Error('Failed to create dynamic payment request. Falling back to static link.');
    }
  }
}

module.exports = new Instamojo();
