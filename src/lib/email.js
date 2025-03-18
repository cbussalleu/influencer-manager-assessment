// src/lib/email.js
import nodemailer from 'nodemailer';

export async function sendInterviewerEmail(result, interviewerEmail) {
  try {
    // Configurar transporter con OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN
      }
    });

    // Extraer información del resultado
    const { 
      responseId, 
      totalScore, 
      masteryLevel, 
      dimensionScores,
      userName,
      userEmail
    } = result;

    // Resto del código para generar el email...
    const dimensionNames = [
      "Gestión de Relaciones con Influencers",
      "Conocimiento de Marketing Digital",
      "Análisis y Métricas",
      "Negociación y Contratos",
      "Gestión de Campañas",
      "Comunicación Estratégica"
    ];

    // Generar preguntas de entrevista
    const interviewQuestions = generateInterviewQuestions(dimensionScores, dimensionNames);

    // Enviar email
    const info = await transporter.sendMail({
      from: `"Assessment Influencer Manager" <${process.env.GMAIL_USER}>`,
      to: interviewerEmail,
      subject: `Resultados de assessment: ${userName} para posición de Influencer Manager`,
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
      `
    });

    console.log('Email enviado al entrevistador:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
}

// Función para generar preguntas de entrevista según las fortalezas/debilidades
function generateInterviewQuestions(scores, dimensionNames) {
  // El mismo código que tenías antes
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

function getSpecificQuestion(dimensionIndex, type) {
  // El mismo código que tenías antes
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
