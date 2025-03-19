// src/lib/sendgrid.js - Implementación completa usando API key
import sgMail from '@sendgrid/mail';

/**
 * Envía un email con los resultados de la evaluación usando SendGrid
 * 
 * @param {Object} result - Resultados de la evaluación
 * @param {string} recipientEmail - Email del destinatario
 * @returns {Promise<boolean>} - true si el email se envió correctamente, false en caso contrario
 */
export async function sendAssessmentEmail(result, recipientEmail) {
  try {
    // Logs de diagnóstico
    console.log('SendGrid service: Starting email send process');
    console.log('SendGrid config:', {
      hasApiKey: !!process.env.SENDGRID_API_KEY,
      senderEmail: process.env.SENDGRID_SENDER_EMAIL || 'Not configured',
      recipientEmail
    });

    // Verificar API key
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid service: No API key provided');
      return false;
    }

    // Verificar el remitente
    if (!process.env.SENDGRID_SENDER_EMAIL) {
      console.error('SendGrid service: No sender email configured');
      return false;
    }

    // Configurar SDK de SendGrid con API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Validar datos del resultado
    if (!result) {
      console.error('SendGrid service: Invalid result data');
      return false;
    }

    // Preparar datos del email
    const userName = result.userName || 'Unknown User';
    const totalScore = result.totalScore || 0;
    const masteryLevel = result.masteryLevel || { description: 'Not Available' };
    const dimensionScores = result.dimensionScores || [];
    const recommendations = result.recommendations || { 
      description: 'No recommendations available',
      generalRecommendations: []
    };
    const responseId = result.responseId || result.response_id || 'Unknown ID';
    
    // Construir el email
    const msg = {
      to: recipientEmail,
      from: {
        email: process.env.SENDGRID_SENDER_EMAIL,
        name: 'Influencer Marketing Assessment'
      },
      subject: `Assessment Results: ${userName} - Influencer Manager Position`,
      html: `
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
      `
    };
    
    // Log del mensaje
    console.log('SendGrid service: Preparing to send email to:', recipientEmail);

    // Enviar el email
    await sgMail.send(msg);
    
    console.log('SendGrid service: Email sent successfully');
    return true;
  } catch (error) {
    // Log detallado de error
    console.error('SendGrid service: Error sending email:', {
      message: error.message,
      code: error.code,
      responseBody: error.response ? JSON.stringify(error.response.body || {}) : 'No response',
      stack: error.stack?.substring(0, 500) || 'No stack trace'
    });
    
    return false;
  }
}

// Función simple para enviar un email de prueba
export async function sendTestEmail(toEmail) {
  try {
    // Verificar configuración
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid test: No API key provided');
      return { success: false, message: 'No SendGrid API key configured' };
    }

    if (!process.env.SENDGRID_SENDER_EMAIL) {
      console.error('SendGrid test: No sender email configured');
      return { success: false, message: 'No sender email configured' };
    }

    // Configurar API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Crear email de prueba
    const msg = {
      to: toEmail,
      from: {
        email: process.env.SENDGRID_SENDER_EMAIL,
        name: 'Influencer Assessment Test'
      },
      subject: 'Test Email from Influencer Marketing Assessment',
      text: 'This is a test email to verify SendGrid configuration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify that SendGrid is configured correctly.</p>'
    };
    
    // Enviar email
    await sgMail.send(msg);
    
    return { 
      success: true, 
      message: 'Test email sent successfully',
      config: {
        fromEmail: process.env.SENDGRID_SENDER_EMAIL,
        toEmail
      }
    };
  } catch (error) {
    console.error('SendGrid test error:', {
      message: error.message,
      code: error.code,
      responseBody: error.response ? JSON.stringify(error.response.body || {}) : 'No response'
    });
    
    return { 
      success: false, 
      message: `Error sending test email: ${error.message}`,
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
}
