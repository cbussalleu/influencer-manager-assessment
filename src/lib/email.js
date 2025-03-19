// src/lib/email.js
import nodemailer from 'nodemailer';

export async function sendInterviewerEmail(result, interviewerEmail) {
  try {
    // Depuración de variables de entorno
    console.log('Email configuration check:');
    console.log('- GMAIL_USER set:', !!process.env.GMAIL_USER);
    console.log('- GMAIL_CLIENT_ID set:', !!process.env.GMAIL_CLIENT_ID);
    console.log('- GMAIL_CLIENT_SECRET set:', !!process.env.GMAIL_CLIENT_SECRET);
    console.log('- GMAIL_REFRESH_TOKEN set:', !!process.env.GMAIL_REFRESH_TOKEN);
    console.log('- Recipient email:', interviewerEmail);

    // Configure transporter with OAuth2 (configuración actualizada)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN
      },
      debug: true // Para ver logs detallados
    });

    // Verificar la conexión antes de intentar enviar
    try {
      await new Promise((resolve, reject) => {
        transporter.verify(function(error, success) {
          if (error) {
            console.error('Transporter verification failed:', error);
            reject(error);
          } else {
            console.log('SMTP connection verified successfully');
            resolve(success);
          }
        });
      });
    } catch (verifyError) {
      console.error('Could not verify SMTP connection:', verifyError);
      // Continuamos de todos modos porque a veces verify falla pero send funciona
    }

    // Extract information from result
    const { 
      responseId, 
      totalScore, 
      masteryLevel, 
      dimensionScores,
      userName,
      userEmail
    } = result;

    // Rest of the code to generate the email...
    const dimensionNames = [
      "Strategic Influencer Selection",
      "Content and Campaign Management",
      "Audience Understanding",
      "Authenticity Cultivation",
      "Analysis and Optimization",
      "Digital Ecosystem Adaptability",
      "Relationship Management"
    ];

    // Generate interview questions
    const interviewQuestions = generateInterviewQuestions(dimensionScores, dimensionNames);

    // Construct email options
    const mailOptions = {
      from: `"Influencer Manager Assessment" <${process.env.GMAIL_USER}>`,
      to: interviewerEmail,
      subject: `Assessment Results: ${userName || 'Candidate'} for Influencer Manager Position`,
      html: `
        <h2>Assessment Summary for ${userName || 'Candidate'}</h2>
        <p>Email: ${userEmail || 'Not provided'}</p>

        <h3>OVERALL SUMMARY:</h3>
        <p><strong>Total Score:</strong> ${totalScore}%</p>
        <p><strong>Level:</strong> ${masteryLevel.description}</p>

        <h3>DIMENSION SCORES:</h3>
        <ul>
          ${dimensionScores.map((score, index) => `
            <li><strong>${dimensionNames[index]}:</strong> ${score.toFixed(1)}%</li>
          `).join('')}
        </ul>

        <h3>RECOMMENDED INTERVIEW QUESTIONS:</h3>
        <ul>
          ${interviewQuestions.map(question => `
            <li>${question}</li>
          `).join('')}
        </ul>

        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/results?response_id=${responseId}">View full report</a></p>
      `
    };

    console.log('Attempting to send email with the following options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // Send email with promise wrapper para mejor manejo de errores
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error in sendMail callback:', error);
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Detailed error sending email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    
    // No lanzamos el error para que no bloquee el flujo principal
    // Pero devolvemos false para indicar que falló
    return false;
  }
}

// Function to generate interview questions based on strengths/weaknesses
function generateInterviewQuestions(scores, dimensionNames) {
  const questions = [];
  
  // Identify strongest and weakest dimensions
  const indexedScores = scores.map((score, index) => ({ score, index }));
  const sortedScores = [...indexedScores].sort((a, b) => a.score - b.score);
  
  // Weakest dimensions (3 lowest)
  const weakDimensions = sortedScores.slice(0, 3);
  
  // Strongest dimensions (2 highest)
  const strongDimensions = sortedScores.slice(-2).reverse();
  
  // Questions for weak dimensions
  weakDimensions.forEach(({ score, index }) => {
    questions.push(`${dimensionNames[index]} (${score.toFixed(1)}%): Inquire about their experience with ${getSpecificQuestion(index, 'weak')}`);
  });
  
  // Questions for strong dimensions
  strongDimensions.forEach(({ score, index }) => {
    questions.push(`${dimensionNames[index]} (${score.toFixed(1)}%): Ask them to share a significant achievement related to ${getSpecificQuestion(index, 'strong')}`);
  });
  
  return questions;
}

function getSpecificQuestion(dimensionIndex, type) {
  const weakQuestions = [
    "strategies for cultivating solid relationships with influencers and what challenges they've faced in this aspect",
    "the aspects of digital marketing they consider most relevant for influencer campaigns",
    "analytical tools they've used to measure the impact of influencer campaigns",
    "difficult experiences in negotiating contracts with influencers and how they resolved them",
    "a project where they had to adjust an ongoing campaign and what they learned",
    "situations where they had to handle complex communications between brands and influencers"
  ];
  
  const strongQuestions = [
    "how they've built lasting relationships with key influencers",
    "how they've integrated digital marketing trends into their influencer strategies",
    "how they use data to optimize campaigns and demonstrate ROI",
    "a case where their negotiation skills generated added value",
    "a particularly successful campaign they've managed and key factors",
    "how they've handled communication in crisis or sensitive situations"
  ];
  
  // Asegurarse de que el índice no esté fuera de rango
  const safeIndex = dimensionIndex % weakQuestions.length;
  return type === 'weak' ? weakQuestions[safeIndex] : strongQuestions[safeIndex];
}
