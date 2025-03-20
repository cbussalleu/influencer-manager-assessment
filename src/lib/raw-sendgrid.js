/**
 * Service for sending emails directly using the SendGrid REST API
 * Doesn't use @sendgrid/mail to avoid any dependency that might use OAuth
 */

/**
 * Selects interview questions based on scores
 * @param {Array} dimensionScores - Scores by dimension
 * @returns {Object} - Selected questions for strengths and weaknesses
 */
function selectInterviewQuestions(dimensionScores) {
  const strengths = [];
  const weaknesses = [];
  
  // Determine strengths and weaknesses
  const dimensionNames = [
    "Strategic Influencer Selection",
    "Content & Campaign Management",
    "Audience Understanding",
    "Authenticity Cultivation",
    "Analysis & Optimization",
    "Digital Ecosystem Adaptability",
    "Relationship Management"
  ];
  
  dimensionScores.forEach((score, index) => {
    if (score >= 70) {
      strengths.push({ name: dimensionNames[index], index });
    }
    if (score <= 50) {
      weaknesses.push({ name: dimensionNames[index], index });
    }
  });
  
  // Question bank by dimension
  const questions = {
    // Strategic Influencer Selection
    0: {
      strengths: [
        "Describe a specific process you've developed to evaluate value alignment between influencers and a mass consumer brand.",
        "Tell me about a time when you rejected working with a popular influencer due to brand congruence concerns. How did you defend this decision?",
        "Can you share a specific methodology you've implemented to analyze an influencer's audience beyond basic demographics?"
      ],
      weaknesses: [
        "What resources or training do you consider necessary to improve your influencer-brand congruence evaluation capability?",
        "How do you plan to develop a more systematic approach for influencer authenticity verification?",
        "If you had access to advanced analytical tools, what new criteria would you implement in your selection process?"
      ]
    },
    // Content & Campaign Management
    1: {
      strengths: [
        "Share an example of a briefing you consider particularly successful. What key elements did you include that facilitated authentic content aligned with the brand?",
        "Describe a complex multinational campaign coordination situation. What systems did you implement to ensure coherence while maintaining local relevance?",
        "How have you specifically integrated influencer campaigns with other marketing channels to amplify results?"
      ],
      weaknesses: [
        "What aspects of your content approval process do you think need optimization?",
        "What tools or methodologies are you considering implementing to improve international campaign management?",
        "How do you plan to improve your ability to balance brand control with influencer authenticity?"
      ]
    },
    // Audience Understanding
    2: {
      strengths: [
        "Describe a specific audience behavior insight you discovered through data analysis and how it transformed an influencer strategy.",
        "Can you share a methodology you've developed to evaluate the emotional resonance of influencer content?",
        "Explain how you've segmented influencer audiences to personalize messages in a specific campaign."
      ],
      weaknesses: [
        "What limitations do you find in your current audience analysis methods and how do you plan to overcome them?",
        "What training or resources are you seeking to deepen your understanding of cultural insights relevant for global audiences?",
        "How do you plan to improve your ability to predict audience behavior?"
      ]
    },
    // Authenticity Cultivation
    3: {
      strengths: [
        "Describe a specific strategy you've implemented to foster genuine connections between influencers and brands.",
        "Share an example where you handled a situation that potentially compromised authenticity perception. What actions did you take?",
        "How have you managed to integrate commercial disclosure requirements without affecting content naturalness?"
      ],
      weaknesses: [
        "What approaches are you considering to strengthen influencers' intrinsic motivation toward the brands you represent?",
        "How do you plan to improve your authenticity-related controversy management protocols?",
        "What resources or knowledge do you seek to better balance commercial objectives and authentic expression?"
      ]
    },
    // Analysis & Optimization
    4: {
      strengths: [
        "Describe an attribution model you've developed to link influencer activities with business results.",
        "Share a specific example where data analysis allowed you to significantly optimize campaign performance.",
        "What customized KPIs have you created to evaluate influencer campaign success beyond standard metrics?"
      ],
      weaknesses: [
        "What limitations do you identify in your current analysis methods and how do you plan to overcome them?",
        "What technologies or methodologies are you exploring to improve your attribution capabilities?",
        "How do you plan to evolve your data-based continuous improvement processes?"
      ]
    },
    // Digital Ecosystem Adaptability
    5: {
      strengths: [
        "Describe an emerging trend you identified early and how you integrated it into your strategy before it became mainstream.",
        "Share an example of how you quickly adapted a strategy in response to a significant algorithm change on a key platform.",
        "What sources and methods do you use to stay at the forefront of innovations in the digital ecosystem?"
      ],
      weaknesses: [
        "What emerging technologies are you currently studying to anticipate their impact on influencer marketing?",
        "How do you plan to structure experimentation processes with new platforms or formats?",
        "What resources or training do you seek to improve your adaptation speed to disruptive changes?"
      ]
    },
    // Relationship Management
    6: {
      strengths: [
        "Describe a brand ambassador program you've developed. What elements do you consider key to its success?",
        "Share an example of how you transformed an initially transactional relationship into a long-term strategic alliance.",
        "Can you describe a complex negotiation situation and how you achieved a mutually beneficial outcome?"
      ],
      weaknesses: [
        "What aspects of your communication with influencers do you think need improvement?",
        "How do you plan to evolve your long-term relationship development strategies?",
        "What specific negotiation or conflict resolution skills are you looking to develop?"
      ]
    }
  };
  
  // Select questions for each strength
  const strengthQuestions = strengths.map(strength => {
    const dimQuestions = questions[strength.index].strengths;
    const selectedQuestions = dimQuestions.slice(0, 2); // Take the first 2 questions
    return {
      dimension: strength.name,
      questions: selectedQuestions
    };
  });
  
  // Select questions for each weakness
  const weaknessQuestions = weaknesses.map(weakness => {
    const dimQuestions = questions[weakness.index].weaknesses;
    const selectedQuestions = dimQuestions.slice(0, 2); // Take the first 2 questions
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
 * Sends an email directly using the SendGrid REST API
 * 
 * @param {object} result - The assessment results
 * @param {string} recipientEmail - Recipient email address
 * @returns {Promise<boolean>} - true if sending was successful, false otherwise
 */
export async function sendDirectEmail(result, recipientEmail) {
  try {
    console.log('Raw SendGrid: Starting to send email...');
    
    // Verify API key
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('Raw SendGrid: Missing API key');
      return false;
    }
    
    // Verify sender email
    const senderEmail = process.env.SENDGRID_SENDER_EMAIL;
    if (!senderEmail) {
      console.error('Raw SendGrid: Missing sender email');
      return false;
    }
    
    // Verify result data
    if (!result) {
      console.error('Raw SendGrid: Invalid result data');
      return false;
    }
    
    // Extract information from the result
    const userName = result.userName || 'Unknown User';
    const totalScore = result.totalScore || 0;
    const masteryLevel = result.masteryLevel || { description: 'Not Available' };
    const dimensionScores = result.dimensionScores || [];
    const responseId = result.responseId || result.response_id || 'Unknown ID';
    
    // Select questions for the interview
    const interviewQuestions = selectInterviewQuestions(dimensionScores);
    
    // Build the HTML content
    const htmlContent = `
      <h2>Assessment Results Summary: ${userName}</h2>
      
      <p>This is a summary of <strong>${userName}</strong>'s assessment results for the Influencer Marketing Manager position.</p>
      
      <h3>OVERALL SUMMARY:</h3>
      <p><strong>Total Score:</strong> ${totalScore}%</p>
      <p><strong>Level:</strong> ${masteryLevel.description}</p>

      <h3>DIMENSION SCORES:</h3>
      <ul>
        ${dimensionScores.map((score, index) => {
          const dimensionName = getDimensionName(index);
          let strengthClass = '';
          if (score >= 70) strengthClass = 'color: green;';
          else if (score <= 50) strengthClass = 'color: orange;';
          
          return `<li><strong>${dimensionName}:</strong> <span style="${strengthClass}">${typeof score === 'number' ? score.toFixed(1) : score}%</span></li>`;
        }).join('')}
      </ul>

      <h3>STRENGTHS AND AREAS FOR IMPROVEMENT:</h3>
      <div style="margin-bottom: 20px;">
        <h4 style="color: green;">Strengths:</h4>
        <ul>
          ${dimensionScores.map((score, index) => {
            if (score >= 70) {
              return `<li><strong>${getDimensionName(index)}:</strong> ${score}%</li>`;
            }
            return '';
          }).filter(Boolean).join('')}
        </ul>
        
        <h4 style="color: orange;">Areas for improvement:</h4>
        <ul>
          ${dimensionScores.map((score, index) => {
            if (score <= 50) {
              return `<li><strong>${getDimensionName(index)}:</strong> ${score}%</li>`;
            }
            return '';
          }).filter(Boolean).join('')}
        </ul>
      </div>

      <h3>SUGGESTED INTERVIEW QUESTIONS:</h3>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: green;">Questions to validate strengths:</h4>
        ${interviewQuestions.strengths.length > 0 ? 
          interviewQuestions.strengths.map(item => `
            <div style="margin-bottom: 15px;">
              <p><strong>${item.dimension}:</strong></p>
              <ul>
                ${item.questions.map(q => `<li>${q}</li>`).join('')}
              </ul>
            </div>
          `).join('') : 
          '<p>No significant strengths identified.</p>'
        }
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: orange;">Questions to explore development plans:</h4>
        ${interviewQuestions.weaknesses.length > 0 ? 
          interviewQuestions.weaknesses.map(item => `
            <div style="margin-bottom: 15px;">
              <p><strong>${item.dimension}:</strong></p>
              <ul>
                ${item.questions.map(q => `<li>${q}</li>`).join('')}
              </ul>
            </div>
          `).join('') : 
          '<p>No significant areas for improvement identified.</p>'
        }
      </div>

      <p style="margin-top: 30px; font-size: 16px;">
        <strong>See ${userName}'s full results:</strong>
      </p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/results?response_id=${responseId}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Complete Assessment
        </a>
      </p>
    `;
    
    // Build the payload for the SendGrid API
    const data = {
      personalizations: [
        {
          to: [
            {
              email: recipientEmail
            }
          ],
          subject: `Assessment Results: ${userName} - Influencer Marketing Manager Position`
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
    
    // Call the SendGrid REST API directly
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    // Verify response
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

// Helper function to get the dimension name
function getDimensionName(index) {
  const dimensions = [
    "Strategic Influencer Selection",
    "Content & Campaign Management",
    "Audience Understanding",
    "Authenticity Cultivation",
    "Analysis & Optimization",
    "Digital Ecosystem Adaptability",
    "Relationship Management"
  ];
  
  return dimensions[index] || `Dimension ${index + 1}`;
}
