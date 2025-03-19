// src/lib/email.js
import nodemailer from 'nodemailer';

export async function sendInterviewerEmail(result, interviewerEmail) {
  try {
    // Configure transporter with OAuth2
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

    // Send email
    const info = await transporter.sendMail({
      from: `"Influencer Manager Assessment" <${process.env.GMAIL_USER}>`,
      to: interviewerEmail,
      subject: `Assessment Results: ${userName} for Influencer Manager Position`,
      html: `
        <h2>Assessment Summary for ${userName}</h2>
        <p>Email: ${userEmail}</p>

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
    });

    console.log('Email sent to interviewer:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Function to generate interview questions based on strengths/weaknesses
function generateInterviewQuestions(scores, dimensionNames) {
  // Same code as before
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
  // Same code as before, but translated to English
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
  
  return type === 'weak' ? weakQuestions[dimensionIndex] : strongQuestions[dimensionIndex];
}
