import sgMail from '@sendgrid/mail';

export async function sendInterviewerEmail(result, interviewerEmail) {
  try {
    // Log more details about environment variables
    console.log('Environment check:', {
      hasSendGridKey: !!process.env.SENDGRID_API_KEY,
      keySample: process.env.SENDGRID_API_KEY ? `${process.env.SENDGRID_API_KEY.substring(0, 3)}...${process.env.SENDGRID_API_KEY.substring(process.env.SENDGRID_API_KEY.length - 3)}` : 'No key',
      emailSender: process.env.SENDGRID_SENDER_EMAIL || 'notifications@influencer-assessment.com',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || ''
    });

    // Configurar la API key de SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Verificar datos del resultado
    if (!result) {
      console.error('Datos de resultado inválidos: resultado es undefined');
      return false;
    }

    // Valores por defecto para manejar casos donde las propiedades pueden estar ausentes
    const userName = result.userName || 'Unknown User';
    const totalScore = result.totalScore || '0';
    const masteryLevel = result.masteryLevel || { description: 'Not Available' };
    const dimensionScores = result.dimensionScores || [];
    const recommendations = result.recommendations || { 
      description: 'No recommendations available',
      generalRecommendations: []
    };
    const responseId = result.responseId || result.response_id || 'N/A';

    // Construir el mensaje de correo
    const msg = {
      to: interviewerEmail,
      from: {
        email: process.env.SENDGRID_SENDER_EMAIL || 'notifications@influencer-assessment.com',
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

    // Log detallado antes de enviar
    console.log('Sending email with payload:', {
      to: msg.to,
      subject: msg.subject,
      userName,
      totalScore,
      masteryLevelDescription: masteryLevel.description
    });

    // Enviar el correo
    const [response] = await sgMail.send(msg);
    
    console.log('Email sent successfully to:', interviewerEmail);
    console.log('SendGrid response:', {
      statusCode: response.statusCode,
      headers: response.headers
    });

    return true;
  } catch (error) {
    // Enhanced error logging
    console.error('Error sending email with SendGrid:', {
      message: error.message,
      code: error.code,
      responseBody: error.response ? JSON.stringify(error.response.body) : 'No response',
      stack: error.stack.split('\n').slice(0, 3).join('\n'),
      // Add detailed auth error info
      authError: error.code === 'EAUTH' ? {
        command: error.command,
        responseCode: error.responseCode,
        response: error.response,
      } : 'Not an auth error'
    });
    
    return false;
  }
}
