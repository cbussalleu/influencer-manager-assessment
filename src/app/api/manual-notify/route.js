import { NextResponse } from 'next/server';
import { getAssessmentResultByResponseId } from '@/lib/models/assessment';
import { sendAssessmentEmail } from '@/lib/sendgrid';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const response_id = searchParams.get('response_id');
    
    console.log('Manual notification requested for response ID:', response_id);
    
    if (!response_id) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing response_id parameter'
      }, { status: 400 });
    }

    // Buscar el resultado en la base de datos
    const result = await getAssessmentResultByResponseId(response_id);
    
    if (!result) {
      return NextResponse.json({ 
        success: false,
        error: 'Assessment result not found'
      }, { status: 404 });
    }
    
    console.log('Found assessment result:', { 
      responseId: result.responseId, 
      userName: result.userName,
      createdAt: result.createdAt
    });

    // Enviar email usando SendGrid
    const interviewerEmail = process.env.INTERVIEWER_EMAIL || 'christian.bussalleu@findasense.com';
    
    console.log('Attempting to send manual notification to:', interviewerEmail);
    
    const emailResult = await sendAssessmentEmail(result, interviewerEmail);
    
    if (emailResult) {
      console.log('Manual notification email sent successfully');
      return NextResponse.json({ 
        success: true,
        message: 'Notification email sent successfully',
        to: interviewerEmail,
        assessmentInfo: {
          responseId: result.responseId,
          userName: result.userName,
          totalScore: result.totalScore
        }
      });
    } else {
      console.error('Failed to send manual notification email');
      return NextResponse.json({ 
        success: false,
        error: 'Failed to send notification email',
        details: 'Check server logs for more information'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error in manual notification:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Error processing manual notification',
      details: error.message
    }, { status: 500 });
  }
}
