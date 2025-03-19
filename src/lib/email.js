import sgMail from '@sendgrid/mail';

export async function sendInterviewerEmail(result, interviewerEmail) {
  try {
    // Configurar la API key de SendGrid de manera simple
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Verificar datos del resultado
    if (!result) {
      console.error('Invalid result data: result is undefined');
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
    const responseId = result.responseId || 'N/A';

    // Construir el mensaje de correo
    const msg = {
      to: interviewerEmail,
      from: {
        email: process.env.SENDGRID_SENDER_EMAIL || 'notifications@yourdomain.com',
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

    // Intentar enviar el correo
    await sgMail.send(msg);
    
    console.log('Email sent successfully to:', interviewerEmail);
    return true;
  } catch (error) {
    // Log detallado del error
    console.error('Detailed SendGrid Email Error:', {
      message: error.message,
      stack: error.stack,
      responseBody: error.response ? JSON.stringify(error.response.body) : 'No response',
      fullError: JSON.stringify(error)
    });
    
    return false;
  }
}
