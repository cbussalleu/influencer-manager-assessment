import sgMail from '@sendgrid/mail';

export async function sendInterviewerEmail(result, interviewerEmail) {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log('SendGrid Configuration:', {
      hasSendGridKey: !!process.env.SENDGRID_API_KEY,
      senderEmail: process.env.SENDGRID_FROM_EMAIL || 'Not configured',
      targetEmail: interviewerEmail
    });

    // Set the API key
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

    // Use a verified sender domain email, not a Gmail address
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'notifications@influencer-assessment.com';

    // Construir el mensaje de correo
    const msg = {
      to: interviewerEmail,
      from: {
        email: fromEmail,
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

    // Log details before sending
    console.log('Preparing to send email:', {
      to: msg.to,
      from: msg.from.email,
      subject: msg.subject
    });

    // Send the email
    const response = await sgMail.send(msg);
    
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    // Enhanced error logging
    console.error('Error sending email with SendGrid:', {
      message: error.message,
      code: error.code,
      responseDetails: error.response ? {
        body: JSON.stringify(error.response.body || {}),
        statusCode: error.response.statusCode
      } : 'No response details'
    });
    
    return false;
  }
}
