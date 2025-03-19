import { NextResponse } from 'next/server';
import { sendInterviewerEmail } from '@/lib/email';
import sgMail from '@sendgrid/mail';

export async function GET(request) {
  try {
    console.log('Test email endpoint called');
    
    // Verificar la configuración de SendGrid
    const apiKey = process.env.SENDGRID_API_KEY;
    const senderEmail = process.env.SENDGRID_SENDER_EMAIL;
    
    // Crear un objeto de resultados de prueba más completo
    const testResult = {
      responseId: 'test-response-id',
      totalScore: 75.5,
      masteryLevel: {
        description: 'Advanced: High performance with sophisticated methodologies'
      },
      dimensionScores: [80, 70, 75, 85, 65, 80, 75],
      userName: 'Test User',
      userEmail: 'test@example.com',
      recommendations: {
        description: 'Based on your assessment, you show strong capabilities in multiple dimensions of influencer marketing.',
        generalRecommendations: [
          'Continue developing your strategic influencer selection skills',
          'Focus on advanced data analysis techniques',
          'Explore innovative approaches in digital ecosystem adaptation'
        ]
      },
      createdAt: new Date().toISOString()
    };
    
    // Obtener el correo de destino de las variables de entorno o usar un valor por defecto
    const targetEmail = process.env.TEST_EMAIL || process.env.INTERVIEWER_EMAIL || 'christian.bussalleu@gmail.com';
    
    console.log('Attempting to send test email to:', targetEmail);
    console.log('SendGrid configuration:', {
      apiKeyExists: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      senderEmail: senderEmail || 'Not configured',
      targetEmail
    });
    
    // Simple validation test
    try {
      sgMail.setApiKey(apiKey);
      // This is a direct API check without sending an email
      await sgMail.validate();
      console.log('SendGrid API key validation successful');
    } catch (validationError) {
      console.error('SendGrid API key validation failed:', validationError.message);
      return NextResponse.json({ 
        success: false,
        message: 'SendGrid API key validation failed',
        error: validationError.message,
        suggestion: 'Please check your SendGrid API key configuration'
      }, { status: 400 });
    }
    
    // Intentar enviar el correo electrónico
    const emailResult = await sendInterviewerEmail(testResult, targetEmail);
    
    if (emailResult) {
      console.log('Test email sent successfully');
      return NextResponse.json({ 
        success: true,
        message: 'Test email sent successfully',
        sentTo: targetEmail
      });
    } else {
      console.log('Test email failed to send');
      return NextResponse.json({ 
        success: false,
        message: 'Failed to send test email. Check server logs for details.',
        sentTo: targetEmail
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error in test-email endpoint:', error);
    return NextResponse.json({ 
      error: 'Error sending test email',
      details: error.message,
      stack: error.stack.split('\n').slice(0, 3).join('\n')
    }, { status: 500 });
  }
}
