import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/sendgrid';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    console.log('Test email endpoint called');
    
    // Obtener el correo de destino, con fallbacks
    const targetEmail = process.env.TEST_EMAIL || 
                        process.env.INTERVIEWER_EMAIL || 
                        'christian.bussalleu@findasense.com';
    
    console.log('Sending test email to:', targetEmail);
    
    // Usar nuestra nueva función de envío de emails de prueba
    const result = await sendTestEmail(targetEmail);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
    
  } catch (error) {
    console.error('Unhandled error in test-email endpoint:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Error sending test email',
      details: error.message
    }, { status: 500 });
  }
}
