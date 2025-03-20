import { NextResponse } from 'next/server';
import { createAssessmentResult, getAssessmentResultByResponseId } from '@/lib/models/assessment';
import { sendDirectEmail } from '@/lib/raw-sendgrid';

export const dynamic = 'force-dynamic';

// Función para procesar respuestas
function processAnswers(formData) {
  // Tu implementación actual de procesamiento
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

// Función para recomendaciones
function getRecommendations(level) {
  return {
    title: "Professional Development Plan",
    description: "Based on your assessment results, we've created this plan.",
    generalRecommendations: [
      "Focus on advanced data analysis techniques",
      "Develop strategic influencer selection methodologies",
      "Enhance your digital ecosystem adaptability"
    ]
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log('Process response params:', Object.fromEntries(searchParams.entries()));
    
    // Obtener response_id
    let response_id = searchParams.get('response_id');
    if (!response_id) {
      return NextResponse.json({ error: 'Missing response_id' }, { status: 400 });
    }
    
    console.log('Processing with response ID:', response_id);
    
    // Datos del usuario
    let userName = searchParams.get('name') || 'Anonymous User';
    let userEmail = searchParams.get('email') || '';
    
    // Procesar y preparar resultados
    const processedResults = processAnswers({});
    const recommendations = getRecommendations(processedResults.masteryLevel.level);
    
    const results = {
      responseId: response_id,
      timestamp: new Date().toISOString(),
      ...processedResults,
      recommendations,
      userName,
      userEmail
    };

    // IMPORTANTE: Guardar en base de datos con await explícito
    try {
      await createAssessmentResult(results);
      console.log('Results saved to database successfully');
      
      // Verificar que se guardaron correctamente
      const savedResult = await getAssessmentResultByResponseId(response_id);
      console.log('Saved result verification:', savedResult ? 'Found in database' : 'NOT FOUND in database');
    } catch (dbError) {
      console.error('Database error:', dbError);
    }
    
    // Enviar email
    try {
      const interviewerEmail = process.env.INTERVIEWER_EMAIL || 'christian.bussalleu@findasense.com';
      const emailSent = await sendDirectEmail(results, interviewerEmail);
      console.log('Email notification status:', emailSent ? 'Sent successfully' : 'Failed to send');
    } catch (emailError) {
      console.error('Email error:', emailError);
    }
    
    // Construir URL con el dominio correcto
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (request.headers.get('host') ? `https://${request.headers.get('host')}` : 
                    'https://influencer-manager-selfassessment.vercel.app');
    
    const resultsUrl = `${baseUrl}/results?response_id=${response_id}`;
    console.log('Redirecting to:', resultsUrl);
    
    return NextResponse.redirect(resultsUrl);
    
  } catch (error) {
    console.error('Critical error in process-response:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
