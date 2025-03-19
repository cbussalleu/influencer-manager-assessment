import sgMail from '@sendgrid/mail';

export async function sendInterviewerEmail(result, interviewerEmail) {
  try {
    // Configurar la API key de SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Verificar datos del resultado
    if (!result || !result.userName) {
      console.error('Datos de resultado inválidos');
      return false;
    }

    // Construir el mensaje de correo
    const msg = {
      to: interviewerEmail,
      from: {
        email: 'notifications@influencer-assessment.com', // Cambia esto por tu email verificado en SendGrid
        name: 'Influencer Marketing Assessment'
      },
      subject: `Assessment Results: ${result.userName} for Influencer Manager Position`,
      html: `
        <h2>Assessment Summary for ${result.userName}</h2>
        
        <h3>OVERALL SUMMARY:</h3>
        <p><strong>Total Score:</strong> ${result.totalScore}%</p>
        <p><strong>Level:</strong> ${result.masteryLevel.description}</p>

        <h3>DIMENSION SCORES:</h3>
        <ul>
          ${result.dimensionScores.map((score, index) => `
            <li><strong>Dimension ${index + 1}:</strong> ${score.toFixed(1)}%</li>
          `).join('')}
        </ul>

        <h3>RECOMMENDATIONS:</h3>
        <p>${result.recommendations.description}</p>

        <ul>
          ${result.recommendations.generalRecommendations.map(rec => `
            <li>${rec}</li>
          `).join('')}
        </ul>

        <p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/results?response_id=${result.responseId}">
            View full report
          </a>
        </p>
      `
    };

    // Enviar el correo
    await sgMail.send(msg);
    
    console.log('Email sent successfully to:', interviewerEmail);
    return true;
  } catch (error) {
    console.error('Error sending email with SendGrid:', {
      message: error.message,
      stack: error.stack,
      response: error.response ? JSON.stringify(error.response.body) : 'No response'
    });
    
    return false;
  }
}
