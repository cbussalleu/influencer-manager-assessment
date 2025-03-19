import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function GET(request) {
  try {
    console.log('Test email endpoint called');
    
    // Verify SendGrid API key is set
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        success: false,
        message: 'SendGrid API key is not configured'
      }, { status: 500 });
    }
    
    // Get the sender and target emails
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'notifications@influencer-assessment.com';
    const toEmail = process.env.TEST_EMAIL || process.env.INTERVIEWER_EMAIL || 'christian.bussalleu@gmail.com';
    
    console.log('Email configuration:', {
      fromEmail,
      toEmail,
      apiKeyExists: !!apiKey
    });
    
    // Set the API key
    sgMail.setApiKey(apiKey);
    
    // Create a simple test email
    const msg = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: 'Influencer Assessment Test'
      },
      subject: 'SendGrid API Test Email',
      text: 'This is a test email to verify SendGrid API configuration',
      html: '<p>This is a test email to verify SendGrid API configuration</p>'
    };
    
    // Send the email
    const response = await sgMail.send(msg);
    
    return NextResponse.json({ 
      success: true,
      message: 'Test email sent successfully',
      sentTo: toEmail,
      from: fromEmail
    });
    
  } catch (error) {
    console.error('Error in test-email endpoint:', {
      message: error.message,
      code: error.code,
      responseBody: error.response ? JSON.stringify(error.response.body) : 'No response'
    });
    
    return NextResponse.json({ 
      success: false,
      error: 'Error sending test email',
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}
