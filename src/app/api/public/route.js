import { NextResponse } from 'next/server';
import { createAssessmentResult, getAssessmentResultByResponseId } from '@/lib/models/assessment';
import { sendInterviewerEmail } from '@/lib/email';  // Asegúrate de que este import apunte al archivo email.js actualizado

export const dynamic = 'force-dynamic';

// Función para procesar respuestas y calcular puntuaciones
function processAnswers(formResponse) {
  // Aquí iría tu lógica de procesamiento actual
  // Por simplificar, devuelvo un objeto con valores de ejemplo
  return {
    dimensionScores: [60, 65, 70, 55, 75, 60, 70],
    totalScore: 65,
    masteryLevel: { 
      level: 4, 
      description: 'Advanced: High capability in influencer marketing management',
      recommendations: 'Focus on advanced analytics to reach expert level'
    },
    rawScores: []
  };
}

// Función para generar recomendaciones basadas en nivel
function getRecommendations(level) {
  // Aquí iría tu lógica actual para generar recomendaciones
  // Devuelvo un objeto de ejemplo
  return {
    title: "Professional Development Plan",
    description: "Based on your assessment, we've created a development plan focused on your opportunity areas.",
    generalRecommendations: [
      "Focus on advanced data analysis techniques",
      "Develop strategic influencer selection methodologies",
      "Enhance your digital ecosystem adaptability"
    ]
  };
}

// Función para extraer datos del usuario de las respuestas
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
    
    // Send email to the interviewer using our updated email function
    const interviewerEmail = process.env.INTERVIEWER_EMAIL || 'christian.bussalleu@findasense.com';
    
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
      console.error('Error sending email:', emailError);
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const response_id = searchParams.get('response_id') || request.headers.get('response-id');
    
    console.log('GET request received with ID:', response_id);
    
    if (!response_id) {
      console.log('No response ID provided in parameters or headers');
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
