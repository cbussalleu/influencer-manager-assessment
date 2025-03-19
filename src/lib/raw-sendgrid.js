/**
 * Servicio para enviar emails directamente usando la API REST de SendGrid
 * No usa @sendgrid/mail para evitar cualquier dependencia que pudiera usar OAuth
 */

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
    const userName = result.userName || 'Unknown User';
    const totalScore = result.totalScore || 0;
    const masteryLevel = result.masteryLevel || { description: 'Not Available' };
    const dimensionScores = result.dimensionScores || [];
    const recommendations = result.recommendations || { 
      description: 'No recommendations available',
      generalRecommendations: []
    };
    const responseId = result.responseId || result.response_id || 'Unknown ID';
    
    // Construir el contenido HTML
    const htmlContent = `
      <h2>Assessment Results for ${userName}</h2>
      
      <h3>OVERALL SUMMARY:</h3>
      <p><strong>Total Score:</strong> ${totalScore}%</p>
      <p><strong>Level:</strong> ${masteryLevel.description}</p>

      <h3>DIMENSION SCORES:</h3>
      <ul>
        ${dimensionScores.map((score, index) => `
          <li><strong>Dimension ${index + 1}:</strong> ${typeof score === 'number' ? score.toFixed(1) : score}%</li>
        `).join('')}
      </ul>

      <h3>RECOMMENDATIONS:</h3>
      <p>${recommendations.description}</p>

      <ul>
        ${recommendations.generalRecommendations?.map(rec => `
          <li>${rec}</li>
        `).join('') || '<li>No specific recommendations</li>'}
      </ul>

      <p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/results?response_id=${responseId}">
          View full report
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
          subject: `Assessment Results: ${userName} - Influencer Manager Position`
        }
      ],
      from: {
        email: senderEmail,
        name: 'Influencer Marketing Assessment'
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
