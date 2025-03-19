import { NextResponse } from 'next/server';
import { createAssessmentResult, getAssessmentResultByResponseId } from '@/lib/models/assessment';
import { sendInterviewerEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Webhook received data:', JSON.stringify(data, null, 2));
    
    const formResponse = data.form_response;
    if (!formResponse) {
      throw new Error('form_response is missing in the received data');
    }
    const response_id = formResponse.token;

    // Process responses to obtain scores
    const processedResults = processAnswers(formResponse);
    
    // Get recommendations based on mastery level
    const recommendations = getRecommendations(processedResults.masteryLevel.level);
    
    // Extract user name and email from responses
    const userData = extractUserData(formResponse);
    
    // Combine all results
    const results = {
      responseId: response_id,
      timestamp: new Date().toISOString(),
      ...processedResults,
      recommendations,
      ...userData
    };

    console.log('Processed results:', JSON.stringify(results, null, 2));

    // Save to database
    const savedResult = await createAssessmentResult(results);
    
    // Send email to the interviewer
    const interviewerEmail = process.env.INTERVIEWER_EMAIL || 'christian.bussalleu@gmail.com';
    
    try {
      console.log('Attempting to send email');
      console.log('Interviewer Email:', interviewerEmail);
      
      const emailSent = await sendInterviewerEmail(results, interviewerEmail);
      
      if (emailSent) {
        console.log('Email sent successfully');
      } else {
        console.error('Email sending failed');
      }
    } catch (emailError) {
      console.error('Unexpected error sending email:', emailError);
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://influencer-manager-assessment.vercel.app'}/results?response_id=${response_id}`;

    return NextResponse.json({ 
      success: true,
      redirectUrl,
      ...results
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ 
      error: 'Error processing webhook',
      details: error.message
    }, { status: 500 });
  }
}

// Function to extract user name and email
function extractUserData(formResponse) {
  let userName = '';
  let userEmail = '';
  
  try {
    // Look for answers by type
    formResponse.answers.forEach(answer => {
      // Assuming name and email are text questions in Typeform
      if (answer.type === 'text') {
        // Find the name field by ID or title
        const field = formResponse.definition.fields.find(f => f.id === answer.field.id);
        
        if (field && field.title.toLowerCase().includes('name')) {
          userName = answer.text;
        } else if (field && (field.title.toLowerCase().includes('email') || field.title.toLowerCase().includes('mail'))) {
          userEmail = answer.text;
        }
      } else if (answer.type === 'email') {
        userEmail = answer.email;
      }
    });
  } catch (error) {
    console.error('Error extracting user data:', error);
  }
  
  return { userName, userEmail };
}

// Resto de las funciones existentes (processAnswers, determineMasteryLevel, getRecommendations) permanecen igual

export async function GET(request) {
  try {
    const response_id = request.headers.get('response-id') || request.headers.get('response_id');
    console.log('GET request received with ID:', response_id);
    
    if (!response_id) {
      console.log('No response ID provided in headers');
      return NextResponse.json({ 
        error: 'Missing response ID'
      }, { status: 400 });
    }

    // Get results from database
    const result = await getAssessmentResultByResponseId(response_id);
    
    console.log('Returning result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ 
      error: 'Error fetching results',
      details: error.message
    }, { status: 500 });
  }
}
