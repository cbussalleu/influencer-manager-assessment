// src/lib/sendgrid.js
import sgMail from '@sendgrid/mail';

/**
 * Servicio dedicado para el envío de emails usando SendGrid
 * Esta implementación usa API key directamente, no OAuth
 */
export async function sendAssessmentEmail(result, recipientEmail) {
  try {
    console.log('SendGrid Email Service: Initiating email send');
    
    // Configurar la API key
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('SendGrid Email Service: Missing API key');
      return false;
    }
    
    sgMail.setApiKey(apiKey);
    
    // Verificar el resultado
    if (!result) {
      console.error('SendGrid Email Service: Invalid result data');
      return false;
    }
    
    // Preparar los datos
    const userName = result.userName || 'Unknown User';
    const totalScore = result.totalScore || '0';
    const masteryLevel = result.masteryLevel || { description: 'Not Available' };
    const dimensionScores = result.dimensionScores || [];
    const recommendations = result.recommendations || { 
      description: 'No recommendations available',
      generalRecommendations: []
    };
    const responseId = result.responseId || result.response_id || 'N/A';
    
    // Obtener el remitente verificado
    const senderEmail = process.env.SENDGRID_SENDER_EMAIL;
    if (!senderEmail) {
      console.error('SendGrid Email Service: Missing sender email configuration');
      return false;
    }
    
    console.log('SendGrid Email Service: Configuration', {
      senderEmail,
      recipientEmail,
      hasApiKey: !!apiKey,
    });
    
    // Preparar el mensaje
    const msg = {
      to: recipientEmail,
      from: {
        email: senderEmail,
        name: 'Influencer Marketing Assessment'
      },
      subject: `Assessment Results: ${userName} for Influencer Manager Position`,
      html: `
        <h2>Assessment Summary for ${userName}</h2>
        
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
          ${recommendations.generalRecommendations.map(rec => `
            <li>${rec}</li>
          `).join('') || '<li>No specific recommendations</li>'}
        </ul>

        <p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/results?response_id=${responseId}">
            View full report
          </a>
        </p>
      `
    };
    
    // Enviar el email
    console.log('SendGrid Email Service: Sending email to', recipientEmail);
    await sgMail.send(msg);
    
    console.log('SendGrid Email Service: Email sent successfully');
    return true;
    
  } catch (error) {
    console.error('SendGrid Email Service: Error sending email', {
      message: error.message,
      code: error.code,
      responseBody: error.response ? JSON.stringify(error.response.body || {}) : 'No response details',
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
    
    return false;
  }
}
