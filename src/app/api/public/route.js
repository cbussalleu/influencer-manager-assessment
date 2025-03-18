
import { NextResponse } from 'next/server';
import { createAssessmentResult } from '@/lib/models/assessment';
import { sendInterviewerEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Webhook received data:', data);
    
    const formResponse = data.form_response;
    if (!formResponse) {
      throw new Error('form_response is missing in the received data');
    }
    const response_id = formResponse.token;

    // Procesar las respuestas para obtener las puntuaciones
    const processedResults = processAnswers(formResponse);
    
    // Obtener recomendaciones basadas en el nivel de maestría
    const recommendations = getRecommendations(processedResults.masteryLevel.level);
    
    // Extraer nombre y email del usuario de las respuestas
    const userData = extractUserData(formResponse);
    
    // Combinar todos los resultados
    const results = {
      response_id,
      timestamp: new Date().toISOString(),
      ...processedResults,
      recommendations,
      ...userData
    };

    console.log('Processed results:', results);

    // Guardar en base de datos
    await createAssessmentResult(results);
    
    // Enviar email al entrevistador
    // Nota: El email del entrevistador podría ser configurable o fijo
    const interviewerEmail = process.env.INTERVIEWER_EMAIL || 'entrevistador@ejemplo.com';
    await sendInterviewerEmail(results, interviewerEmail);

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://influencer-manager-assessment.vercel.app'}/results?response_id=${response_id}`;

    return NextResponse.json({ 
      success: true,
      redirectUrl,
      ...results
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Error processing webhook',
      details: error.message
    }, { status: 500 });
  }
}

// Función para extraer nombre y email del usuario
function extractUserData(formResponse) {
  let userName = '';
  let userEmail = '';
  
  try {
    // Buscar respuestas por tipo
    formResponse.answers.forEach(answer => {
      // Asumiendo que el nombre y email son preguntas de texto en Typeform
      if (answer.type === 'text') {
        // Buscar el campo de nombre por ID o título
        const field = formResponse.definition.fields.find(f => f.id === answer.field.id);
        
        if (field && field.title.toLowerCase().includes('nombre')) {
          userName = answer.text;
        } else if (field && field.title.toLowerCase().includes('email') || field.title.toLowerCase().includes('correo')) {
          userEmail = answer.text;
        }
      } else if (answer.type === 'email') {
        userEmail = answer.email;
      }
    });
  } catch (error) {
    console.error('Error extraer datos de usuario:', error);
  }
  
  return { userName, userEmail };
}

// Funciones de procesamiento igual que antes, adaptadas a Influencer Manager
function processAnswers(formResponse) {
  try {
    // Filtrar solo las preguntas de opción múltiple
    const multipleChoiceAnswers = formResponse.answers.filter(answer => 
      answer && answer.type === 'choice'
    );

    // Calcular el score de cada respuesta según su posición
    const scoredAnswers = multipleChoiceAnswers.map(answer => {
      const field = formResponse.definition.fields.find(f => f.id === answer.field.id);
      
      if (!field || !field.choices) {
        console.warn(`No choices found for field ${answer.field.id}`);
        return 1; // valor por defecto
      }
      
      const choiceIndex = field.choices.findIndex(choice => 
        choice.label === answer.choice.label
      );
      
      return choiceIndex + 1; // +1 para que el primer índice sea 1
    });

    // Dividir respuestas en dimensiones (4 variables por dimensión)
    const dimensionScores = [];
    const numDimensions = 6; // 6 dimensiones
    
    for (let i = 0; i < numDimensions; i++) {
      const start = i * 4;
      const end = start + 4;
      const dimensionAnswers = scoredAnswers.slice(start, end);
      
      if (dimensionAnswers.length > 0) {
        const dimensionScore = dimensionAnswers.reduce((a, b) => a + b, 0) / dimensionAnswers.length;
        dimensionScores.push(dimensionScore * 20); // Convertir a porcentaje (1-5 -> 20-100%)
      } else {
        dimensionScores.push(0); // En caso de no tener respuestas para esta dimensión
      }
    }

    // Calcular score total
    const totalScore = dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length;

    // Determinar nivel de madurez
    const masteryLevel = determineMasteryLevel(totalScore);

    return {
      dimensionScores,
      totalScore,
      masteryLevel,
      rawScores: scoredAnswers
    };
  } catch (error) {
    console.error('Error processing answers:', error);
    // Devolver valores por defecto en caso de error
    return {
      dimensionScores: [0, 0, 0, 0, 0, 0],
      totalScore: 0,
      masteryLevel: determineMasteryLevel(0),
      rawScores: []
    };
  }
}

function determineMasteryLevel(score) {
  if (score <= 20) {
    return {
      level: 1,
      description: "Principiante",
      recommendations: "Requiere desarrollo fundamental en gestión de influencers"
    };
  } else if (score <= 40) {
    return {
      level: 2, 
      description: "En desarrollo",
      recommendations: "Necesita fortalecer capacidades clave de influencer marketing"
    };
  } else if (score <= 60) {
    return {
      level: 3,
      description: "Competente",
      recommendations: "Buen potencial, debe perfeccionar aspectos específicos"
    };
  } else if (score <= 80) {
    return {
      level: 4,
      description: "Avanzado",
      recommendations: "Alto desempeño, puede liderar estrategias con influencers"
    };
  } else {
    return {
      level: 5,
      description: "Experto",
      recommendations: "Nivel de excelencia, capacidad para innovar en el campo"
    };
  }
}

function getRecommendations(level) {
  const recommendationMap = {
    1: {
      title: "Desarrollo Inicial como Influencer Manager",
      description: "Estás iniciando tu carrera en gestión de influencers. Enfócate en adquirir conocimientos fundamentales y construir una red inicial.",
      generalRecommendations: [
        "Familiarízate con plataformas de redes sociales y sus métricas básicas",
        "Aprende fundamentos de marketing digital e influencer marketing",
        "Practica habilidades de comunicación y relaciones interpersonales",
        "Estudia casos exitosos de campañas con influencers"
      ],
      interviewPreparation: [
        "Investiga agencias y marcas que trabajan con influencers",
        "Prepara ejemplos de campañas que admiras y por qué",
        "Demuestra tu capacidad de aprendizaje y adaptabilidad",
        "Enfoca tus respuestas en tu potencial y entusiasmo por aprender"
      ]
    },
    2: {
      title: "Crecimiento en Gestión de Influencers",
      description: "Tienes conocimientos básicos de influencer marketing. Es momento de profundizar y adquirir experiencia práctica.",
      generalRecommendations: [
        "Desarrolla habilidades específicas en la gestión de relaciones con creadores",
        "Aprende sobre contratos y aspectos legales del influencer marketing",
        "Practica análisis de métricas y reporting de campañas",
        "Expande tu red de contactos en el ecosistema de influencers"
      ],
      interviewPreparation: [
        "Prepara ejemplos concretos de campañas en las que has participado",
        "Destaca tu conocimiento de herramientas específicas y plataformas",
        "Menciona cómo has resuelto desafíos específicos con influencers",
        "Muestra tu comprensión de la selección estratégica de influencers"
      ]
    },
    3: {
      title: "Competencia Profesional en Influencer Marketing",
      description: "Tienes una base sólida en gestión de influencers. Es momento de especializarte y destacar.",
      generalRecommendations: [
        "Especialízate en nichos o industrias específicas",
        "Perfecciona tus habilidades de negociación y gestión de presupuestos",
        "Desarrolla estrategias de medición de ROI más sofisticadas",
        "Amplía tu conocimiento sobre tendencias emergentes y nuevas plataformas"
      ],
      interviewPreparation: [
        "Destaca campañas donde tu contribución fue significativa",
        "Explica tu enfoque para evaluar el éxito de las campañas",
        "Comparte ejemplos de negociaciones exitosas con influencers",
        "Demuestra conocimiento sobre tendencias actuales del mercado"
      ]
    },
    4: {
      title: "Liderazgo en Influencer Marketing",
      description: "Tienes un alto nivel de experiencia. Enfócate en estrategias avanzadas y liderazgo.",
      generalRecommendations: [
        "Desarrolla estrategias integradas multicanal con influencers",
        "Implementa enfoques de datos avanzados para optimizar campañas",
        "Lidera equipos y gestiona relaciones con influencers de alto nivel",
        "Innova en formatos y enfoques de colaboración con creadores"
      ],
      interviewPreparation: [
        "Presenta casos de estudio detallados de campañas que lideraste",
        "Explica tu visión estratégica para el futuro del influencer marketing",
        "Destaca tu capacidad para gestionar crisis y situaciones complejas",
        "Muestra cómo has integrado influencers en estrategias de marketing más amplias"
      ]
    },
    5: {
      title: "Excelencia en Influencer Management",
      description: "Eres un referente en el sector. Continúa innovando y definiendo mejores prácticas.",
      generalRecommendations: [
        "Desarrolla estrategias pioneras en el campo",
        "Mentoriza a otros profesionales y comparte conocimientos",
        "Establece relaciones estratégicas con los principales influencers de la industria",
        "Participa en la definición de estándares y mejores prácticas del sector"
      ],
      interviewPreparation: [
        "Posiciónate como thought leader con ideas innovadoras",
        "Explica cómo has transformado equipos o departamentos completos",
        "Destaca colaboraciones de alto impacto con influencers reconocidos",
        "Demuestra tu visión para evolucionar el rol de los influencers en el marketing"
      ]
    }
  };

  return recommendationMap[level] || recommendationMap[1];
}

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

    // Obtener resultados de la base de datos
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
