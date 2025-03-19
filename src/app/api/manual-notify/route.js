import { NextResponse } from 'next/server';
import { getAssessmentResultByResponseId } from '@/lib/models/assessment';
import { sendDirectEmail } from '@/lib/raw-sendgrid';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener el ID de respuesta - puede venir de varios parámetros
    let response_id = searchParams.get('response_id');
    
    // Verificar si necesitamos redireccionar después (para uso con Typeform)
    const redirect = searchParams.get('redirect') === 'true';
    
    console.log('Manual notify called with params:', {
      response_id,
      redirect,
      allParams: Object.fromEntries(searchParams.entries())
    });
    
    // Si aún no tenemos ID, es un error
    if (!response_id) {
      console.error('No response ID provided in parameters');
      
      if (redirect) {
        // Si se pidió redirección, vamos a la página principal
        return NextResponse.redirect(new URL('/', request.url));
      } else {
        // Si es una llamada API normal, devolvemos error
        return NextResponse.json({ 
          success: false,
          error: 'Missing response_id parameter',
          params: Object.fromEntries(searchParams.entries())
        }, { status: 400 });
      }
    }
    
    console.log('Manual notification requested for response ID:', response_id);

    // Buscar el resultado en la base de datos
    const result = await getAssessmentResultByResponseId(response_id);
    
    if (!result) {
      console.log('Assessment result not found for ID:', response_id);
      
      if (redirect) {
        // Si se pidió redirección, vamos a resultados con mensaje de error
        return NextResponse.redirect(new URL(`/?error=results-not-found&id=${response_id}`, request.url));
      } else {
        // Si es una llamada API normal, devolvemos error
        return NextResponse.json({ 
          success: false,
          error: 'Assessment result not found'
        }, { status: 404 });
      }
    }
    
    console.log('Found assessment result:', { 
      responseId: result.responseId, 
      userName: result.userName,
      createdAt: result.createdAt
    });

    // Enviar email usando el método directo
    const interviewerEmail = process.env.INTERVIEWER_EMAIL || 'christian.bussalleu@findasense.com';
    
    console.log('Attempting to send notification to:', interviewerEmail);
    
    try {
      const emailResult = await sendDirectEmail(result, interviewerEmail);
      
      if (emailResult) {
        console.log('Notification email sent successfully');
      } else {
        console.error('Failed to send notification email');
      }
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
    }
    
    // Si se pidió redirección, enviamos al usuario a la página de resultados
    if (redirect) {
      const resultsUrl = `/results?response_id=${response_id}`;
      console.log('Redirecting to results page:', resultsUrl);
      
      return NextResponse.redirect(new URL(resultsUrl, request.url));
    } else {
      // Respuesta normal de API para uso programático
      return NextResponse.json({ 
        success: true,
        message: 'Notification email sent',
        to: interviewerEmail,
        assessmentInfo: {
          responseId: result.responseId,
          userName: result.userName,
          totalScore: result.totalScore
        }
      });
    }
    
  } catch (error) {
    console.error('Error in manual notification:', error);
    
    if (searchParams.get('redirect') === 'true') {
      // Si se pidió redirección, vamos a la página principal
      return NextResponse.redirect(new URL('/', request.url));
    } else {
      // Respuesta normal de API
      return NextResponse.json({ 
        success: false,
        error: 'Error processing notification',
        details: error.message
      }, { status: 500 });
    }
  }
}
