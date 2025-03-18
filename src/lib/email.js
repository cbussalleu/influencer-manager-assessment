import sgMail from '@sendgrid/mail';

// Configura la API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendInterviewerEmail(result, interviewerEmail) {
  try {
    // Extraer información del resultado
    const { 
      responseId, 
      totalScore, 
      masteryLevel, 
      dimensionScores,
      userName,
      userEmail
    } = result;

    // Construir resumen de dimensiones
    const dimensionNames = [
      "Gestión de Relaciones con Influencers",
      "Conocimiento de Marketing Digital",
      "Análisis y Métricas",
      "Negociación y Contratos",
      "Gestión de Campañas",
      "Comunicación Estratégica"
    ];

    const dimensionSummaries = dimensionScores.map((score, index) => {
      return `${dimensionNames[index]}: ${score.toFixed(1)}%`;
    }).join('\n');

    // Generar preguntas de entrevista recomendadas basadas en puntuaciones
    const interviewQuestions = generateInterviewQuestions(dimensionScores, dimensionNames);

    // Construir el mensaje de correo electrónico
    const msg = {
      to: interviewerEmail,
      from: process.env.SENDGRID_FROM_EMAIL, // Email verificado en SendGrid
      subject: `Resultados de assessment: ${userName} para posición de Influencer Manager`,
      text: `
Resumen de Assessment para ${userName}
Email: ${userEmail}

RESUMEN GENERAL:
Score Total: ${totalScore}%
Nivel: ${masteryLevel.description}

PUNTUACIONES POR DIMENSIÓN:
${dimensionSummaries}

PREGUNTAS RECOMENDADAS PARA LA ENTREVISTA:
${interviewQuestions.join('\n\n')}

Accede a más detalles en: ${process.env.NEXT_PUBLIC_BASE_URL}/results?response_id=${responseId}
`,
      html: `
<h2>Resumen de Assessment para ${userName}</h2>
<p>Email: ${userEmail}</p>

<h3>RESUMEN GENERAL:</h3>
<p><strong>Score Total:</strong> ${totalScore}%</p>
<p><strong>Nivel:</strong> ${masteryLevel.description}</p>

<h3>PUNTUACIONES POR DIMENSIÓN:</h3>
<ul>
  ${dimensionScores.map((score, index) => `
    <li><strong>${dimensionNames[index]}:</strong> ${score.toFixed(1)}%</li>
  `).join('')}
</ul>

<h3>PREGUNTAS RECOMENDADAS PARA LA ENTREVISTA:</h3>
<ul>
  ${interviewQuestions.map(question => `
    <li>${question}</li>
  `).join('')}
</ul>

<p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/results?response_id=${responseId}">Ver reporte completo</a></p>
`,
    };

    // Enviar el correo electrónico
    await sgMail.send(msg);
    console.log('Email enviado al entrevistador');
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
}

// Función para generar preguntas de entrevista según las fortalezas/debilidades
function generateInterviewQuestions(scores, dimensionNames) {
  const questions = [];
  
  // Identificar las dimensiones más fuertes y débiles
  const indexedScores = scores.map((score, index) => ({ score, index }));
  const sortedScores = [...indexedScores].sort((a, b) => a.score - b.score);
  
  // Dimensiones más débiles (3 más bajas)
  const weakDimensions = sortedScores.slice(0, 3);
  
  // Dimensiones más fuertes (2 más altas)
  const strongDimensions = sortedScores.slice(-2).reverse();
  
  // Preguntas para dimensiones débiles
  weakDimensions.forEach(({ score, index }) => {
    questions.push(`${dimensionNames[index]} (${score.toFixed(1)}%): Indague sobre su experiencia con ${getSpecificQuestion(index, 'weak')}`);
  });
  
  // Preguntas para dimensiones fuertes
  strongDimensions.forEach(({ score, index }) => {
    questions.push(`${dimensionNames[index]} (${score.toFixed(1)}%): Pida que comparta un logro significativo relacionado con ${getSpecificQuestion(index, 'strong')}`);
  });
  
  return questions;
}

// Función para obtener preguntas específicas basadas en la dimensión
function getSpecificQuestion(dimensionIndex, type) {
  const weakQuestions = [
    "estrategias para cultivar relaciones sólidas con influencers y qué desafíos ha enfrentado en este aspecto",
    "los aspectos del marketing digital que considera más relevantes para campañas con influencers",
    "herramientas analíticas que ha usado para medir el impacto de campañas con influencers",
    "experiencias difíciles en negociación de contratos con influencers y cómo las resolvió",
    "un proyecto donde tuvo que ajustar una campaña en progreso y qué aprendió",
    "situaciones donde tuvo que manejar comunicaciones complejas entre marcas e influencers"
  ];
  
  const strongQuestions = [
    "cómo ha construido relaciones duraderas con influencers clave",
    "cómo ha integrado tendencias de marketing digital en sus estrategias de influencers",
    "cómo utiliza datos para optimizar campañas y demostrar ROI",
    "un caso donde su habilidad de negociación generó valor añadido",
    "una campaña particularmente exitosa que haya gestionado y factores clave",
    "cómo ha manejado la comunicación en situaciones de crisis o sensibles"
  ];
  
  return type === 'weak' ? weakQuestions[dimensionIndex] : strongQuestions[dimensionIndex];
}
