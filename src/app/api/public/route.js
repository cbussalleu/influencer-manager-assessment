import { NextResponse } from 'next/server';
import { createAssessmentResult } from '@/lib/models/assessment';
// ¡Importante! NO importamos ninguna funcionalidad de email directamente

export const dynamic = 'force-dynamic';

// Procesamiento de respuestas (mantenemos la lógica original)
function processAnswers(formResponse) {
  // Tu lógica de procesamiento existente
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

// Generación de recomendaciones (mantenemos la lógica original)
function getRecommendations(level) {
  // Tu lógica de recomendaciones existente
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

// Extracción de datos de usuario (mantenemos la lógica original)
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

// Función auxiliar para activar el envío de email de forma separada
async function triggerEmailNotification(responseId) {
  try {
    // Determinamos la URL base para la llamada al endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  'http://localhost:3000';
    
    // Construimos la URL completa para el endpoint de notificación
    const notifyUrl = `${baseUrl}/api/manual-notify?response_id=${responseId}`;
    
    console.log('Triggering email notification via separate HTTP call:', notifyUrl);
    
    // Realizamos la llamada HTTP al endpoint de notificación
    const response = await fetch(notifyUrl);
    const result = await response.json();
    
    if (response.ok) {
      console.log('Email notification triggered successfully:', result);
      return { success: true };
    } else {
      console.error('Failed to trigger email notification:', result);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error triggering email notification:', error);
    return { success: false, error: error.message };
  }
}

export async function POST(request) {
  console.log('Webhook POST request received');
  
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
    console.log('Results saved to database');
    
    // AUTOMATIZACIÓN: Después de guardar los datos, activamos el email mediante una llamada HTTP separada
    console.log('Attempting to trigger email notification for response ID:', response_id);
    triggerEmailNotification(response_id).catch(error => {
      console.error('Failed to trigger email notification:', error);
    });
    
    // No esperamos a que se complete el envío del email para devolver la respuesta
    // Esto hace más robusto el proceso y evita tiempos de espera innecesarios

    // Construir URL de redirección
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://influencer-manager-assessment.vercel.app'}/results?response_id=${response_id}`;

    return NextResponse.json({ 
      success: true,
      redirectUrl,
      responseId: response_id
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ 
      error: 'Error processing webhook',
      details: error.message
    }, { status: 500 });
  }
}

// Mantenemos el método GET sin cambios
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const response_id = searchParams.get('response_id') || request.headers.get('response-id');
    
    if (!response_id) {
      return NextResponse.json({ 
        error: 'Missing response ID'
      }, { status: 400 });
    }

    // Get results from database
    const result = await getAssessmentResultByResponseId(response_id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ 
      error: 'Error fetching results',
      details: error.message
    }, { status: 500 });
  }
}
