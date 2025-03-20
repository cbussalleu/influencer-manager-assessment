/**
 * Servicio para enviar emails directamente usando la API REST de SendGrid
 * No usa @sendgrid/mail para evitar cualquier dependencia que pudiera usar OAuth
 */

/**
 * Selecciona preguntas de entrevista basadas en puntuaciones
 * @param {Array} dimensionScores - Puntuaciones por dimensión
 * @returns {Object} - Preguntas seleccionadas para fortalezas y debilidades
 */
function selectInterviewQuestions(dimensionScores) {
  const strengths = [];
  const weaknesses = [];
  
  // Determinar fortalezas y debilidades
  const dimensionNames = [
    "Selección Estratégica de Influencers",
    "Gestión de Contenido y Campañas",
    "Comprensión de Audiencias",
    "Cultivo de Autenticidad y Transparencia",
    "Análisis y Optimización",
    "Adaptabilidad al Ecosistema Digital",
    "Gestión de Relaciones"
  ];
  
  dimensionScores.forEach((score, index) => {
    if (score >= 70) {
      strengths.push({ name: dimensionNames[index], index });
    }
    if (score <= 50) {
      weaknesses.push({ name: dimensionNames[index], index });
    }
  });
  
  // Banco de preguntas por dimensión
  const questions = {
    // Selección Estratégica de Influencers
    0: {
      strengths: [
        "Describa un proceso específico que haya desarrollado para evaluar la alineación de valores entre influencers y una marca de consumo masivo.",
        "Cuénteme sobre una ocasión en que rechazó trabajar con un influencer popular debido a preocupaciones de congruencia con la marca. ¿Cómo defendió esta decisión?",
        "¿Puede compartir una metodología específica que haya implementado para analizar la audiencia de un influencer más allá de las demografías básicas?"
      ],
      weaknesses: [
        "¿Qué recursos o formación considera necesarios para mejorar su capacidad de evaluación de congruencia influencer-marca?",
        "¿Cómo planea desarrollar un enfoque más sistemático para la verificación de autenticidad de influencers?",
        "Si tuviera acceso a herramientas analíticas avanzadas, ¿qué nuevos criterios implementaría en su proceso de selección?"
      ]
    },
    // Gestión de Contenido y Campañas
    1: {
      strengths: [
        "Comparta un ejemplo de briefing que considere particularmente exitoso. ¿Qué elementos clave incluyó que facilitaron contenido auténtico y alineado con la marca?",
        "Describa una situación compleja de coordinación de campaña multinacional. ¿Qué sistemas implementó para garantizar coherencia manteniendo relevancia local?",
        "¿Cómo ha integrado específicamente campañas de influencers con otros canales de marketing para amplificar resultados?"
      ],
      weaknesses: [
        "¿Qué aspectos de su proceso de aprobación de contenido considera que necesitan optimización?",
        "¿Qué herramientas o metodologías está considerando implementar para mejorar la gestión de campañas internacionales?",
        "¿Cómo planea mejorar su capacidad para balancear el control de marca con la autenticidad del influencer?"
      ]
    },
    // Comprensión de Audiencias
    2: {
      strengths: [
        "Describa un insight específico sobre comportamiento de audiencia que descubrió a través de análisis de datos y cómo transformó una estrategia de influencers.",
        "¿Puede compartir una metodología que haya desarrollado para evaluar la resonancia emocional del contenido de influencers?",
        "Explique cómo ha segmentado audiencias de influencers para personalizar mensajes en una campaña específica."
      ],
      weaknesses: [
        "¿Qué limitaciones encuentra en sus métodos actuales de análisis de audiencia y cómo planea superarlas?",
        "¿Qué formación o recursos está buscando para profundizar su comprensión de insights culturales relevantes para audiencias globales?",
        "¿Cómo planea mejorar su capacidad de predicción del comportamiento de audiencias?"
      ]
    },
    // Cultivo de Autenticidad y Transparencia
    3: {
      strengths: [
        "Describa una estrategia específica que haya implementado para fomentar conexiones genuinas entre influencers y marcas.",
        "Comparta un ejemplo donde haya manejado una situación que potencialmente comprometía la percepción de autenticidad. ¿Qué acciones tomó?",
        "¿Cómo ha logrado integrar requisitos de divulgación comercial sin afectar la naturalidad del contenido?"
      ],
      weaknesses: [
        "¿Qué enfoques está considerando para fortalecer la motivación intrínseca de los influencers hacia las marcas que representa?",
        "¿Cómo planea mejorar sus protocolos de gestión de controversias relacionadas con autenticidad?",
        "¿Qué recursos o conocimientos busca adquirir para equilibrar mejor los objetivos comerciales y la expresión auténtica?"
      ]
    },
    // Análisis y Optimización
    4: {
      strengths: [
        "Describa un modelo de atribución que haya desarrollado para vincular actividades de influencers con resultados de negocio.",
        "Comparta un ejemplo específico donde el análisis de datos le permitió optimizar significativamente el rendimiento de una campaña.",
        "¿Qué KPIs personalizados ha creado para evaluar el éxito de campañas de influencers más allá de métricas estándar?"
      ],
      weaknesses: [
        "¿Qué limitaciones identifica en sus métodos actuales de análisis y cómo planea superarlas?",
        "¿Qué tecnologías o metodologías está explorando para mejorar sus capacidades de atribución?",
        "¿Cómo planea evolucionar sus procesos de mejora continua basados en datos?"
      ]
    },
    // Adaptabilidad al Ecosistema Digital
    5: {
      strengths: [
        "Describa una tendencia emergente que identificó tempranamente y cómo la integró en su estrategia antes que se volviera mainstream.",
        "Comparta un ejemplo de cómo adaptó rápidamente una estrategia ante un cambio significativo de algoritmo en una plataforma clave.",
        "¿Qué fuentes y métodos utiliza para mantenerse a la vanguardia de innovaciones en el ecosistema digital?"
      ],
      weaknesses: [
        "¿Qué tecnologías emergentes está estudiando actualmente para anticipar su impacto en el influencer marketing?",
        "¿Cómo planea estructurar procesos de experimentación con nuevas plataformas o formatos?",
        "¿Qué recursos o formación busca para mejorar su velocidad de adaptación ante cambios disruptivos?"
      ]
    },
    // Gestión de Relaciones
    6: {
      strengths: [
        "Describa un programa de embajadores de marca que haya desarrollado. ¿Qué elementos considera clave para su éxito?",
        "Comparta un ejemplo de cómo transformó una relación inicialmente transaccional en una alianza estratégica a largo plazo.",
        "¿Puede describir una situación compleja de negociación y cómo logró un resultado mutuamente beneficioso?"
      ],
      weaknesses: [
        "¿Qué aspectos de su comunicación con influencers considera que necesitan mejora?",
        "¿Cómo planea evolucionar sus estrategias de desarrollo de relaciones a largo plazo?",
        "¿Qué habilidades específicas de negociación o resolución de conflictos está buscando desarrollar?"
      ]
    }
  };
  
  // Seleccionar preguntas para cada fortaleza
  const strengthQuestions = strengths.map(strength => {
    const dimQuestions = questions[strength.index].strengths;
    const selectedQuestions = dimQuestions.slice(0, 2); // Tomar las primeras 2 preguntas
    return {
      dimension: strength.name,
      questions: selectedQuestions
    };
  });
  
  // Seleccionar preguntas para cada debilidad
  const weaknessQuestions = weaknesses.map(weakness => {
    const dimQuestions = questions[weakness.index].weaknesses;
    const selectedQuestions = dimQuestions.slice(0, 2); // Tomar las primeras 2 preguntas
    return {
      dimension: weakness.name,
      questions: selectedQuestions
    };
  });
  
  return {
    strengths: strengthQuestions,
    weaknesses: weaknessQuestions
  };
}

/**
 * Envía un email usando directamente la API REST de SendGrid
 * 
 * @param {object} result - Los resultados de la evaluación
 * @param {string} recipientEmail - Dirección de correo del destinatario
 * @returns {Promise<boolean>} - true si el envío fue exitoso, false en caso contrario
 */
export async function sendDirectEmail(result, recipientEmail) {
  try {
    console.log('Raw SendGrid: Starting to send email...');
    
    // Verificar API key
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('Raw SendGrid: Missing API key');
      return false;
    }
    
    // Verificar email remitente
    const senderEmail = process.env.SENDGRID_SENDER_EMAIL;
    if (!senderEmail) {
      console.error('Raw SendGrid: Missing sender email');
      return false;
    }
    
    // Verificar datos del resultado
    if (!result) {
      console.error('Raw SendGrid: Invalid result data');
      return false;
    }
    
    // Extraer información del resultado
    const userName = result.userName || 'Anonymous User';
    const totalScore = result.totalScore || 0;
    const masteryLevel = result.masteryLevel || { description: 'Not Available' };
    const dimensionScores = result.dimensionScores || [];
    const recommendations = result.recommendations || { 
      description: 'No recommendations available',
      generalRecommendations: []
    };
    const responseId = result.responseId || result.response_id || 'Unknown ID';
    
    // Seleccionar preguntas para la entrevista
    const interviewQuestions = selectInterviewQuestions(dimensionScores);
    
    // Construir el contenido HTML
    const htmlContent = `
      <h2>Resumen de Resultados de la Evaluación: ${userName}</h2>
      
      <p>Este es el resumen de resultados de la evaluación de <strong>${userName}</strong> para la posición de Influencer Marketing Manager.</p>
      
      <h3>RESUMEN GENERAL:</h3>
      <p><strong>Puntuación Total:</strong> ${totalScore}%</p>
      <p><strong>Nivel:</strong> ${masteryLevel.description}</p>

      <h3>PUNTUACIONES POR DIMENSIÓN:</h3>
      <ul>
        ${dimensionScores.map((score, index) => {
          const dimensionName = getDimensionName(index);
          let strengthClass = '';
          if (score >= 70) strengthClass = 'color: green;';
          else if (score <= 50) strengthClass = 'color: orange;';
          
          return `<li><strong>${dimensionName}:</strong> <span style="${strengthClass}">${typeof score === 'number' ? score.toFixed(1) : score}%</span></li>`;
        }).join('')}
      </ul>

      <h3>FORTALEZAS Y ÁREAS DE MEJORA:</h3>
      <div style="margin-bottom: 20px;">
        <h4 style="color: green;">Fortalezas:</h4>
        <ul>
          ${dimensionScores.map((score, index) => {
            if (score >= 70) {
              return `<li><strong>${getDimensionName(index)}:</strong> ${score}%</li>`;
            }
            return '';
          }).filter(Boolean).join('')}
        </ul>
        
        <h4 style="color: orange;">Áreas de mejora:</h4>
        <ul>
          ${dimensionScores.map((score, index) => {
            if (score <= 50) {
              return `<li><strong>${getDimensionName(index)}:</strong> ${score}%</li>`;
            }
            return '';
          }).filter(Boolean).join('')}
        </ul>
      </div>

      <h3>PREGUNTAS SUGERIDAS PARA LA ENTREVISTA:</h3>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: green;">Preguntas para validar fortalezas:</h4>
        ${interviewQuestions.strengths.length > 0 ? 
          interviewQuestions.strengths.map(item => `
            <div style="margin-bottom: 15px;">
              <p><strong>${item.dimension}:</strong></p>
              <ul>
                ${item.questions.map(q => `<li>${q}</li>`).join('')}
              </ul>
            </div>
          `).join('') : 
          '<p>No se identificaron fortalezas significativas.</p>'
        }
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: orange;">Preguntas para explorar planes de desarrollo:</h4>
        ${interviewQuestions.weaknesses.length > 0 ? 
          interviewQuestions.weaknesses.map(item => `
            <div style="margin-bottom: 15px;">
              <p><strong>${item.dimension}:</strong></p>
              <ul>
                ${item.questions.map(q => `<li>${q}</li>`).join('')}
              </ul>
            </div>
          `).join('') : 
          '<p>No se identificaron áreas de mejora significativas.</p>'
        }
      </div>

      <h3>RECOMENDACIONES:</h3>
      <p>${recommendations.description}</p>

      <ul>
        ${recommendations.generalRecommendations?.map(rec => `
          <li>${rec}</li>
        `).join('') || '<li>No hay recomendaciones específicas disponibles.</li>'}
      </ul>

      <p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/results?response_id=${responseId}">
          Ver informe completo
        </a>
      </p>
    `;
    
    // Construir el payload para la API de SendGrid
    const data = {
      personalizations: [
        {
          to: [
            {
              email: recipientEmail
            }
          ],
          subject: `Resultados de Evaluación: ${userName} - Posición de Influencer Marketing Manager`
        }
      ],
      from: {
        email: senderEmail,
        name: 'Evaluación de Influencer Marketing'
      },
      content: [
        {
          type: 'text/html',
          value: htmlContent
        }
      ]
    };
    
    console.log('Raw SendGrid: Preparing to send email to:', recipientEmail);
    
    // Llamar directamente a la API REST de SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    // Verificar respuesta
    if (response.ok) {
      console.log('Raw SendGrid: Email sent successfully');
      return true;
    } else {
      const errorText = await response.text();
      console.error('Raw SendGrid: API error', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return false;
    }
    
  } catch (error) {
    console.error('Raw SendGrid: Error sending email', {
      message: error.message,
      stack: error.stack?.substring(0, 500)
    });
    return false;
  }
}

// Función auxiliar para obtener el nombre de la dimensión
function getDimensionName(index) {
  const dimensions = [
    "Selección Estratégica de Influencers",
    "Gestión de Contenido y Campañas",
    "Comprensión de Audiencias",
    "Cultivo de Autenticidad y Transparencia",
    "Análisis y Optimización",
    "Adaptabilidad al Ecosistema Digital",
    "Gestión de Relaciones"
  ];
  
  return dimensions[index] || `Dimensión ${index + 1}`;
}
