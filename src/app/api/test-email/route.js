import { NextResponse } from 'next/server';
import { sendInterviewerEmail } from '@/lib/email';

export async function GET(request) {
  try {
    console.log('Test email endpoint called');
    
    // Crear un objeto de resultados de prueba
    const testResult = {
      responseId: 'test-response-id',
      totalScore: 75.5,
      masteryLevel: {
        level: 4,
        description: 'Advanced: High performance with sophisticated methodologies'
      },
      dimensionScores: [80, 70, 75, 85, 65, 80, 75],
      userName: 'Test User',
      userEmail: 'test@example.com',
      createdAt: new Date().toISOString()
    };
    
    // Obtener el correo de destino de las variables de entorno o usar un valor por defecto
    const targetEmail = process.env.TEST_EMAIL || process.env.INTERVIEWER_EMAIL || 'your-email@example.com';
    
    console.log('Attempting to send test email to:', targetEmail);
    
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
      details: error.message
    }, { status: 500 });
  }
}
