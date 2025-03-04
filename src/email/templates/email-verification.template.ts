const generateVerificationEmailTemplate = (payload: {
    fullName: string;
    verificationLink: string;
}): string => {
    const { fullName, verificationLink } = payload;
    const year = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #333333;
      margin: 0;
    }
    .content {
      color: #555555;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888888;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email Address</h1>
    </div>
    <div class="content">
      <p>Hello ${fullName},</p>
      <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
      <a href="${verificationLink}" class="button">Verify Email</a>
      <p>If you did not create an account, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${year} WoekspaceR. All rights reserved.</p>
      <p><a href="[[UNSUB_LINK_EN]]" style="color:inherit;text-decoration:none;" target="_blank">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
    `;
};


export {generateVerificationEmailTemplate}
