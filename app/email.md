this is for product enquiry 
<!DOCTYPE html>
<html>
<head>
  <title>Product Inquiry - Tej Lite</title>
</head>

<body style="font-family: Inter, Arial, sans-serif; background:#f4f6fb; padding:20px;">

  <div style="max-width:650px;margin:auto;background:#fff;border-radius:16px;overflow:hidden">

    <!-- Header -->
    <div style="background:#d4af37;color:#fff;text-align:center;padding:30px">
      <h1 style="margin:0;font-family:Playfair Display,serif;">TEJ LITE</h1>
      <p style="margin:5px 0 0;letter-spacing:2px">Premium Lighting Solutions</p>
    </div>

    <!-- Greeting -->
    <div style="padding:30px">
      <h2 style="text-align:center;color:#2c3e50;">
        New Product Inquiry Received
      </h2>

      <p style="text-align:center;color:#555;">
        A customer has shown interest in one of your products.  
        Below are the complete details.
      </p>

      <!-- Product Details -->
      <div style="background:#f8f9fa;padding:20px;border-radius:12px;margin-top:30px">
        <h3 style="color:#d4af37;margin-bottom:10px">Product Details</h3>

        <p><b>Name:</b> {{product_name}}</p>
        <p><b>Category:</b> {{product_category}}</p>
        <p><b>Description:</b><br>{{product_description}}</p>

        <img src="{{product_image}}" alt="Product Image"
          style="width:100%;max-height:240px;object-fit:cover;border-radius:10px;margin:15px 0">

        <p>
          <a href="{{product_url}}" style="color:#d4af37;font-weight:600">View Product</a>
        </p>
      </div>

      <!-- Customer Details -->
      <div style="background:#ffffff;border:1px solid #e9ecef;padding:20px;border-radius:12px;margin-top:30px">
        <h3 style="color:#d4af37;margin-bottom:10px">Customer Details</h3>

        <p><b>Name:</b> {{customer_name}}</p>
        <p><b>Email:</b> {{customer_email}}</p>
        <p><b>Phone:</b> {{customer_phone}}</p>
        <p><b>Date:</b> {{inquiry_date}}</p>

        <div style="margin-top:15px;padding:15px;border:2px dashed #d4af37;border-radius:10px">
          <b>Message:</b><br>
          {{customer_message}}
        </div>
      </div>

      <!-- Actions -->
      <div style="text-align:center;margin-top:30px">
        <a href="mailto:{{customer_email}}"
           style="display:inline-block;padding:12px 24px;background:#d4af37;color:#fff;border-radius:30px;text-decoration:none;margin:5px">
           Reply via Email
        </a>

        <a href="tel:{{customer_phone}}"
           style="display:inline-block;padding:12px 24px;background:#2c3e50;color:#fff;border-radius:30px;text-decoration:none;margin:5px">
           Call Customer
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#2c3e50;color:#ecf0f1;text-align:center;padding:20px">
      <p style="font-size:13px;opacity:0.8">
        This inquiry was submitted from Tej Lite website
      </p>
      <p style="font-size:12px;opacity:0.6">
        © 2024 Tej Lite — Connecting Light To Life
      </p>
    </div>

  </div>

</body>
</html>
 







 tthis is for contact us enquiry 
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message - Tej Lite</title>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 20px;
    }

    .email-container {
      max-width: 650px;
      margin: auto;
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }

    .header {
      background: linear-gradient(135deg, #d4af37, #f4e4a6);
      padding: 35px;
      text-align: center;
    }

    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 38px;
      font-weight: 700;
      color: #ffffff;
    }

    .tagline {
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.9);
    }

    .content {
      padding: 35px;
    }

    .title {
      font-size: 24px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 15px;
      color: #2c3e50;
    }

    .subtitle {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 30px;
      font-size: 15px;
    }

    .info-box {
      background: #f8f9fa;
      border-radius: 14px;
      padding: 25px;
      border: 1px solid #e9ecef;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .field {
      background: #ffffff;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .label {
      font-size: 12px;
      font-weight: 600;
      color: #d4af37;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .value {
      font-size: 15px;
      color: #2c3e50;
      font-weight: 500;
    }

    .message-box {
      margin-top: 20px;
      padding: 20px;
      border: 2px dashed #d4af37;
      border-radius: 10px;
      background: #ffffff;
    }

    .footer {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 30px;
      text-align: center;
    }

    .footer h4 {
      color: #d4af37;
      margin-bottom: 10px;
      font-family: 'Playfair Display', serif;
    }

    .footer p {
      font-size: 13px;
      opacity: 0.85;
    }

    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>

<body>
  <div class="email-container">

    <div class="header">
      <div class="logo">TEJ LITE</div>
      <div class="tagline">Everything in Lighting</div>
    </div>

    <div class="content">
      <div class="title">New Contact Form Submission</div>
      <div class="subtitle">
        A visitor has submitted the contact form on your website.
      </div>

      <div class="info-box">
        <div class="info-grid">
          <div class="field">
            <div class="label">Name</div>
            <div class="value">{{from_name}}</div>
          </div>

          <div class="field">
            <div class="label">Email</div>
            <div class="value">{{from_email}}</div>
          </div>

          <div class="field">
            <div class="label">Phone</div>
            <div class="value">{{phone}}</div>
          </div>

          <div class="field">
            <div class="label">Date</div>
            <div class="value">{{date}}</div>
          </div>
        </div>

        <div class="message-box">
          <div class="label">Message</div>
          <div class="value">{{message}}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <h4>Tej Lite Admin Notification</h4>
      <p>Please respond to the inquiry at the earliest.</p>
      <p style="margin-top: 10px; font-size: 12px;">
        © Tej Lite — Connecting Light To Life
      </p>
    </div>

  </div>
</body>
</html>
