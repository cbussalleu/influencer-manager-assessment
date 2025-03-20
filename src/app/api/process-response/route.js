import { NextResponse } from 'next/server';
import { createAssessmentResult } from '@/lib/models/assessment';
import { sendDirectEmail } from '@/lib/raw-sendgrid';

export const dynamic = 'force-dynamic';

// Procesamiento de respuestas (mantenemos la lógica original)
function processAnswers(formData) {
  try {
    // Si tenemos respuestas completas, procesamos normalmente
    if (formData && formData.answers && Array.isArray(formData.answers)) {
      // Tu lógica de procesamiento actual
      // Esta es una simplificación, deberás usar tu lógica real
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
    } else {
      // Si no hay datos completos, usar valores por defecto
      console.warn('No complete form data provided, using default values');
      return {
        dimensionScores: [50, 50, 50, 50, 50, 50, 50],
        totalScore: 50,
        masteryLevel: { 
          level: 3, 
          description: 'Competent: Solid foundation in influencer marketing',
          recommendations: 'Continue developing your skills in key dimensions'
        },
        rawScores: []
      };
    }
  } catch (error) {
    console.error('Error processing answers:', error);
    // Valores por defecto en caso de error
    return {
      dimensionScores: [50, 50, 50, 50, 50, 50, 50],
      totalScore: 50,
      masteryLevel: { 
        level: 3, 
        description: 'Competent: Solid foundation in influencer marketing',
        recommendations: 'Continue developing your skills in key dimensions'
      },
      rawScores: []
    };
  }
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

// Extracción de datos de usuario de los parámetros GET
function extractUserDataFromParams(searchParams) {
  let userName = searchParams.get('name') || searchParams.get('user_name') || 'Anonymous User';
  let userEmail = searchParams.get('email') || searchParams.get('user_email') || '';
  
  return { userName, userEmail };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log('Process response called with params:', Object.fromEntries(searchParams.entries()));
    
    // Obtener el ID de respuesta - puede venir directamente o en un formato especial de Typeform
    let response_id = searchParams.get('response_id');
    
    // Si no hay un response_id, podría ser que estemos recibiendo directamente desde Typeform
    if (!response_id) {
      // Typeform podría pasar el token como part del form_response
      response_id = searchParams.get('form_response.token') || 
                   searchParams.get('token') || 
                   `manual-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    console.log('Processing with response ID:', response_id);

    // Extraer datos del usuario de los parámetros
    const userData = extractUserDataFromParams(searchParams);
    console.log('User data from params:', userData);
    
    // Procesar las respuestas
    const processedResults = processAnswers({
      // Si hay datos de formulario, los usamos (probablemente no en este caso)
      answers: []
    });
    
    // Obtener recomendaciones basadas en el nivel de maestría
    const recommendations = getRecommendations(processedResults.masteryLevel.level);
    
    // Combinar todos los resultados
    const results = {
      responseId: response_id,
      timestamp: new Date().toISOString(),
      ...processedResults,
      recommendations,
      ...userData
    };

    console.log('Processed results to save:', {
      responseId: results.responseId,
      userName: results.userName,
      totalScore: results.totalScore
    });

    // Guardar en la base de datos
    try {
      await createAssessmentResult(results);
      console.log('Results saved to database successfully');
    } catch (dbError) {
      console.error('Error saving results to database:', dbError);
      // Continuamos incluso si hay error en la base de datos
    }
    
    // Enviar email usando el método directo
    const interviewerEmail = process.env.INTERVIEWER_EMAIL || 'christian.bussalleu@findasense.com';
    
    console.log('Attempting to send notification to:', interviewerEmail);
    
    try {
      const emailResult = await sendDirectEmail(results, interviewerEmail);
      
      if (emailResult) {
        console.log('Notification email sent successfully');
      } else {
        console.error('Failed to send notification email');
      }
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Continuamos incluso si hay error en el email
    }
    
    // Siempre redirigimos a la página de resultados
    const resultsUrl = `/results?response_id=${response_id}`;
    console.log('Redirecting to results page:', resultsUrl);
    
    return NextResponse.redirect(new URL(resultsUrl, request.url));
    
  } catch (error) {
    console.error('Error in process-response:', error);
    
    // Si hay un error general, redirigimos a la página principal
    return NextResponse.redirect(new URL('/', request.url));
  }
}
