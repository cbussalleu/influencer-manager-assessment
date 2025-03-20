import { NextResponse } from 'next/server';
import { createAssessmentResult, getAssessmentResultByResponseId } from '@/lib/models/assessment';
import { sendDirectEmail } from '@/lib/raw-sendgrid';

export const dynamic = 'force-dynamic';

// Función para obtener datos completos de Typeform
async function fetchTypeformResponse(responseId) {
  try {
    // Si tienes una API key de Typeform, puedes usarla para obtener la respuesta completa
    const typeformApiKey = process.env.TYPEFORM_API_KEY;
    const formId = "TBBqrH5Q"; // ID de tu formulario
    
    if (typeformApiKey) {
      const response = await fetch(
        `https://api.typeform.com/forms/${formId}/responses?included_response_ids=${responseId}`,
        {
          headers: {
            'Authorization': `Bearer ${typeformApiKey}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          return data.items[0];
        }
      }
    }
    
    // Si no hay API key o hay algún error, devolvemos null
    return null;
  } catch (error) {
    console.error('Error fetching Typeform response:', error);
    return null;
  }
}

// Función mejorada para procesar respuestas
function processAnswers(formResponse) {
  try {
    // Si tenemos la respuesta completa del formulario
    if (formResponse && formResponse.answers && Array.isArray(formResponse.answers)) {
      console.log('Processing complete form response');
      
      // Mapear las respuestas a puntajes según la estructura de tu formulario
      // Esto es un ejemplo - ajusta según tus preguntas y lógica específica
      const scores = {};
      const rawScores = [];
      
      // Procesar cada respuesta
      formResponse.answers.forEach(answer => {
        // Aquí implementar la lógica específica para tu formulario
        // Por ejemplo:
        if (answer.type === 'choice') {
          // Para preguntas de opción múltiple, mapear cada opción a un puntaje
          let score = 0;
          if (answer.choice && answer.choice.label) {
            // Ejemplo: mapear etiquetas a puntajes (ajustar según tu formulario)
            const label = answer.choice.label.toLowerCase();
            if (label.includes('nunca') || label.includes('básico')) score = 20;
            else if (label.includes('raramente') || label.includes('principiante')) score = 40;
            else if (label.includes('a veces') || label.includes('intermedio')) score = 60;
            else if (label.includes('frecuentemente') || label.includes('avanzado')) score = 80;
            else if (label.includes('siempre') || label.includes('experto')) score = 100;
          }
          rawScores.push(score);
          
          // Asignar el puntaje a la dimensión correspondiente
          // Esto requiere un mapeo de preguntas a dimensiones específico a tu formulario
        }
      });
      
      // Ejemplo de cálculo de puntajes por dimensión
      // Necesitas definir qué preguntas corresponden a cada dimensión
      const dimensionScores = [
        calculateDimensionScore(rawScores, [0, 1, 2]), // Dimensión 1: preguntas 0, 1, 2
        calculateDimensionScore(rawScores, [3, 4, 5]), // Dimensión 2: preguntas 3, 4, 5
        calculateDimensionScore(rawScores, [6, 7, 8]), // etc.
        calculateDimensionScore(rawScores, [9, 10, 11]),
        calculateDimensionScore(rawScores, [12, 13, 14]),
        calculateDimensionScore(rawScores, [15, 16, 17]),
        calculateDimensionScore(rawScores, [18, 19, 20])
      ];
      
      // Calcular puntaje total
      const totalScore = dimensionScores.reduce((sum, score) => sum + score, 0) / dimensionScores.length;
      
      // Determinar nivel de maestría
      const masteryLevel = determineMasteryLevel(totalScore);
      
      return {
        dimensionScores,
        totalScore,
        masteryLevel,
        rawScores
      };
    } else {
      console.log('No complete form data, using sample calculation');
      
      // Si no hay datos completos, fallback a un cálculo simple
      // Esto es temporal - deberías implementar la lógica real
      return sampleCalculation();
    }
  } catch (error) {
    console.error('Error processing answers:', error);
    return sampleCalculation();
  }
}

// Función auxiliar para calcular el puntaje de una dimensión
function calculateDimensionScore(rawScores, questionIndices) {
  if (!rawScores || !rawScores.length) return 50;
  
  let sum = 0;
  let count = 0;
  
  for (const index of questionIndices) {
    if (index < rawScores.length && typeof rawScores[index] === 'number') {
      sum += rawScores[index];
      count++;
    }
  }
  
  return count > 0 ? Math.round(sum / count) : 50;
}

// Función auxiliar para determinar el nivel de maestría
function determineMasteryLevel(totalScore) {
  if (totalScore <= 20) {
    return {
      level: 1,
      description: 'Basic: Beginning level in influencer marketing',
      recommendations: 'Focus on building a strong foundation in all key areas'
    };
  } else if (totalScore <= 40) {
    return {
      level: 2,
      description: 'Developing: Growing capabilities in influencer marketing',
      recommendations: 'Continue developing core competencies across all dimensions'
    };
  } else if (totalScore <= 60) {
    return {
      level: 3,
      description: 'Competent: Solid proficiency in influencer marketing',
      recommendations: 'Work on advancing to the next level in your strongest areas'
    };
  } else if (totalScore <= 80) {
    return {
      level: 4,
      description: 'Advanced: High capability in influencer marketing management',
      recommendations: 'Focus on advanced analytics to reach expert level'
    };
  } else {
    return {
      level: 5,
      description: 'Expert: Mastery of influencer marketing strategies',
      recommendations: 'Share your expertise and continue innovating in the field'
    };
  }
}

// Función de cálculo de muestra (fallback)
function sampleCalculation() {
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

// Función para generar recomendaciones personalizadas
function getRecommendations(level, dimensionScores) {
  // Identificar fortalezas y áreas de mejora
  const strengths = [];
  const weaknesses = [];
  
  dimensionScores.forEach((score, index) => {
    const dimensionName = getDimensionName(index);
    if (score >= 75) {
      strengths.push(dimensionName);
    } else if (score <= 50) {
      weaknesses.push(dimensionName);
    }
  });
  
  // Generar recomendaciones basadas en el nivel y áreas identificadas
  const recommendations = {
    title: "Personalized Development Plan",
    description: `Based on your assessment as a Level ${level} Influencer Marketing Manager, we've created this development plan.`,
    generalRecommendations: []
  };
  
  // Añadir recomendaciones basadas en fortalezas
  if (strengths.length > 0) {
    recommendations.generalRecommendations.push(
      `Leverage your strengths in ${strengths.join(', ')} to develop other areas`
    );
  }
  
  // Añadir recomendaciones basadas en áreas de mejora
  if (weaknesses.length > 0) {
    recommendations.generalRecommendations.push(
      `Focus on developing your skills in ${weaknesses.join(', ')}`
    );
  }
  
  // Añadir recomendaciones generales basadas en el nivel
  if (level <= 2) {
    recommendations.generalRecommendations.push(
      "Build foundational knowledge in core influencer marketing principles",
      "Study successful case studies from leading brands"
    );
  } else if (level === 3) {
    recommendations.generalRecommendations.push(
      "Develop advanced analytics capabilities",
      "Work on strategic campaign planning across multiple platforms"
    );
  } else {
    recommendations.generalRecommendations.push(
      "Focus on innovation and thought leadership",
      "Develop methodologies for measuring long-term brand impact"
    );
  }
  
  return recommendations;
}

// Función auxiliar para obtener el nombre de la dimensión
function getDimensionName(index) {
  const dimensions = [
    "Strategic Influencer Selection",
    "Content & Campaign Management",
    "Audience Understanding",
    "Authenticity Cultivation",
    "Analysis & Optimization",
    "Digital Ecosystem Adaptability",
    "Relationship Management"
  ];
  
  return dimensions[index] || `Dimension ${index + 1}`;
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
    console.log('Process response params:', Object.fromEntries(searchParams.entries()));
    
    // Obtener response_id
    let response_id = searchParams.get('response_id');
    if (!response_id) {
      return NextResponse.json({ error: 'Missing response_id' }, { status: 400 });
    }
    
    console.log('Processing with response ID:', response_id);
    
    // Intentar obtener datos completos de Typeform
    const typeformResponse = await fetchTypeformResponse(response_id);
    let userData = extractUserDataFromParams(searchParams);
    
    // Si tenemos datos de Typeform, extraer nombre y email
    if (typeformResponse) {
      console.log('Successfully retrieved Typeform response data');
      
      // Extraer nombre y email de las respuestas si están disponibles
      if (typeformResponse.answers) {
        for (const answer of typeformResponse.answers) {
          if (answer.type === 'text' || answer.type === 'email') {
            // Buscar preguntas de nombre o email basado en el título o ref
            const questionId = answer.field.id;
            const questionRef = answer.field.ref;
            
            // Aquí necesitarías identificar las preguntas específicas de nombre y email
            // basado en los IDs o refs de tu formulario
            if (questionRef === 'nombre_ref' || questionId === 'nombre_id') {
              userData.userName = answer.text || userData.userName;
            } else if (questionRef === 'email_ref' || questionId === 'email_id' || answer.type === 'email') {
              userData.userEmail = answer.email || answer.text || userData.userEmail;
            }
          }
        }
      }
    }
    
    console.log('User data:', userData);
    
    // Procesar respuestas
    const processedResults = processAnswers(typeformResponse);
    
    // Obtener recomendaciones personalizadas
    const recommendations = getRecommendations(
      processedResults.masteryLevel.level, 
      processedResults.dimensionScores
    );
    
    // Combinar todos los resultados
    const results = {
      responseId: response_id,
      timestamp: new Date().toISOString(),
      ...processedResults,
      recommendations,
      ...userData
    };

    console.log('Processed results:', {
      responseId: results.responseId,
      userName: results.userName,
      totalScore: results.totalScore,
      level: results.masteryLevel.level
    });

    // Guardar en la base de datos
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
