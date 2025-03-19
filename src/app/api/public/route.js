import { NextResponse } from 'next/server';
import { createAssessmentResult } from '@/lib/models/assessment';
import { sendInterviewerEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Webhook received data:', data);
    
    const formResponse = data.form_response;
    if (!formResponse) {
      throw new Error('form_response is missing in the received data');
    }
    const response_id = formResponse.token;

    // Process responses to obtain scores
    const processedResults = processAnswers(formResponse);
    
    // Get recommendations based on mastery level
    const recommendations = getRecommendations(processedResults.masteryLevel.level);
    
    // Extract user name and email from responses
    const userData = extractUserData(formResponse);
    
    // Combine all results
    const results = {
      response_id,
      timestamp: new Date().toISOString(),
      ...processedResults,
      recommendations,
      ...userData
    };

    console.log('Processed results:', results);

    // Save to database
    await createAssessmentResult(results);
    
    // Send email to the interviewer
    // Note: The interviewer email could be configurable or fixed
    const interviewerEmail = process.env.INTERVIEWER_EMAIL || 'interviewer@example.com';
    await sendInterviewerEmail(results, interviewerEmail);

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://influencer-manager-assessment.vercel.app'}/results?response_id=${response_id}`;

    return NextResponse.json({ 
      success: true,
      redirectUrl,
      ...results
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Error processing webhook',
      details: error.message
    }, { status: 500 });
  }
}

// Function to extract user name and email
function extractUserData(formResponse) {
  let userName = '';
  let userEmail = '';
  
  try {
    // Look for answers by type
    formResponse.answers.forEach(answer => {
      // Assuming name and email are text questions in Typeform
      if (answer.type === 'text') {
        // Find the name field by ID or title
        const field = formResponse.definition.fields.find(f => f.id === answer.field.id);
        
        if (field && field.title.toLowerCase().includes('name')) {
          userName = answer.text;
        } else if (field && (field.title.toLowerCase().includes('email') || field.title.toLowerCase().includes('mail'))) {
          userEmail = answer.text;
        }
      } else if (answer.type === 'email') {
        userEmail = answer.email;
      }
    });
  } catch (error) {
    console.error('Error extracting user data:', error);
  }
  
  return { userName, userEmail };
}

// Process answers according to the weight system defined in the questionnaire
function processAnswers(formResponse) {
  try {
    // Filter only multiple choice questions
    const multipleChoiceAnswers = formResponse.answers.filter(answer => 
      answer && (answer.type === 'choice' || answer.type === 'number')
    );

    // Calculate the score of each answer according to its position
    const scoredAnswers = multipleChoiceAnswers.map(answer => {
      // For scale questions (1-5)
      if (answer.type === 'number') {
        // Convert 1-5 scale to 0-100%
        return (answer.number - 1) * 25;
      }
      
      // For multiple choice questions
      else if (answer.type === 'choice') {
        const field = formResponse.definition.fields.find(f => f.id === answer.field.id);
        
        if (!field || !field.choices) {
          console.warn(`No choices found for field ${answer.field.id}`);
          return 25; // default value
        }
        
        // Find the index of the selected choice
        const choiceIndex = field.choices.findIndex(choice => 
          choice.label === answer.choice.label
        );
        
        // Map the choice index to a score
        // This is a simplified approach - in a real implementation you would
        // have a more sophisticated mapping based on the answer scoring defined
        // in the self-assessment questionnaire
        const scores = [0, 25, 50, 75, 100];
        return scores[choiceIndex] || 50;
      }
      
      return 50; // default score for other types
    });

    // Organize answers by dimensions (using the question IDs from Typeform)
    // These mappings should match exactly the question IDs in your Typeform
    const dimensionMappings = {
      "strategic_selection": {
        questions: ["question_1", "question_2", "question_3", "question_4"],
        weights: { 
          "question_1": 0.30, // Value alignment
          "question_2": 0.25, // Congruence evaluation
          "question_3": 0.25, // Audience analysis
          "question_4": 0.20  // Verification process
        }
      },
      "content_management": {
        questions: ["question_5", "question_6", "question_7", "question_8"],
        weights: {
          "question_5": 0.25, // Briefing development
          "question_6": 0.30, // Control/authenticity balance
          "question_7": 0.25, // Campaign coordination
          "question_8": 0.20  // Multichannel integration
        }
      },
      "audience_understanding": {
        questions: ["question_9", "question_10", "question_11", "question_12"],
        weights: {
          "question_9": 0.25,  // Engagement analysis
          "question_10": 0.25, // Segmentation
          "question_11": 0.30, // Cultural insight
          "question_12": 0.20  // Resonance measurement
        }
      },
      "authenticity_cultivation": {
        questions: ["question_13", "question_14", "question_15", "question_16"],
        weights: {
          "question_13": 0.30, // Perception management
          "question_14": 0.20, // Commercial transparency
          "question_15": 0.30, // Intrinsic motivation
          "question_16": 0.20  // Controversy management
        }
      },
      "analysis_optimization": {
        questions: ["question_17", "question_18", "question_19", "question_20"],
        weights: {
          "question_17": 0.25, // KPI definition
          "question_18": 0.25, // Attribution
          "question_19": 0.30, // Data analysis
          "question_20": 0.20  // Continuous improvement
        }
      },
      "digital_adaptability": {
        questions: ["question_21", "question_22", "question_23", "question_24"],
        weights: {
          "question_21": 0.30, // Adaptation speed
          "question_22": 0.25, // Trend monitoring
          "question_23": 0.25, // Experimentation
          "question_24": 0.20  // Technological vision
        }
      },
      "relationship_management": {
        questions: ["question_25", "question_26", "question_27", "question_28"],
        weights: {
          "question_25": 0.30, // Long-term development
          "question_26": 0.25, // Effective communication
          "question_27": 0.20, // Negotiation
          "question_28": 0.25  // Conflict resolution
        }
      }
    };

    // Create a mapping of question IDs to answers
    const questionMap = {};
    multipleChoiceAnswers.forEach((answer, index) => {
      questionMap[answer.field.id] = scoredAnswers[index];
    });

    // Calculate dimension scores
    const dimensionScores = [];
    let totalScore = 0;

    Object.entries(dimensionMappings).forEach(([dimension, config]) => {
      let dimensionTotal = 0;
      let weightSum = 0;

      config.questions.forEach(questionId => {
        if (questionMap[questionId] !== undefined) {
          const weight = config.weights[questionId];
          dimensionTotal += questionMap[questionId] * weight;
          weightSum += weight;
        }
      });

      const dimensionScore = weightSum > 0 ? dimensionTotal / weightSum : 0;
      dimensionScores.push(dimensionScore);
      totalScore += dimensionScore;
    });

    // Calculate average total score
    totalScore = dimensionScores.length > 0 ? totalScore / dimensionScores.length : 0;

    // Determine mastery level
    const masteryLevel = determineMasteryLevel(totalScore);

    return {
      dimensionScores,
      totalScore,
      masteryLevel,
      rawScores: scoredAnswers
    };
  } catch (error) {
    console.error('Error processing answers:', error);
    // Return default values in case of error
    return {
      dimensionScores: [0, 0, 0, 0, 0, 0, 0],
      totalScore: 0,
      masteryLevel: determineMasteryLevel(0),
      rawScores: []
    };
  }
}

function determineMasteryLevel(score) {
  if (score <= 20) {
    return {
      level: 1,
      description: "Basic",
      recommendations: "Requires fundamental development in influencer management"
    };
  } else if (score <= 40) {
    return {
      level: 2, 
      description: "Developing",
      recommendations: "Needs to strengthen key capabilities in influencer marketing"
    };
  } else if (score <= 60) {
    return {
      level: 3,
      description: "Competent",
      recommendations: "Good potential, should refine specific aspects"
    };
  } else if (score <= 80) {
    return {
      level: 4,
      description: "Advanced",
      recommendations: "High performance, capable of leading influencer strategies"
    };
  } else {
    return {
      level: 5,
      description: "Expert",
      recommendations: "Excellence level, capacity to innovate in the field"
    };
  }
}

function getRecommendations(level) {
  const recommendationMap = {
    1: {
      title: "Initial Development as Influencer Manager",
      description: "You are beginning your career in influencer management. Focus on acquiring fundamental knowledge and building an initial network.",
      generalRecommendations: [
        "Familiarize yourself with social media platforms and their basic metrics",
        "Learn fundamentals of digital marketing and influencer marketing",
        "Practice communication skills and interpersonal relationships",
        "Study successful cases of influencer campaigns"
      ],
      interviewPreparation: [
        "Research agencies and brands that work with influencers",
        "Prepare examples of campaigns you admire and why",
        "Demonstrate your learning capacity and adaptability",
        "Focus your answers on your potential and enthusiasm for learning"
      ]
    },
    2: {
      title: "Growth in Influencer Management",
      description: "You have basic knowledge of influencer marketing. It's time to deepen and acquire practical experience.",
      generalRecommendations: [
        "Develop specific skills in creator relationship management",
        "Learn about contracts and legal aspects of influencer marketing",
        "Practice campaign metrics analysis and reporting",
        "Expand your network of contacts in the influencer ecosystem"
      ],
      interviewPreparation: [
        "Prepare concrete examples of campaigns you've participated in",
        "Highlight your knowledge of specific tools and platforms",
        "Mention how you've solved specific challenges with influencers",
        "Show your understanding of strategic influencer selection"
      ]
    },
    3: {
      title: "Professional Competence in Influencer Marketing",
      description: "You have a solid foundation in influencer management. It's time to specialize and stand out.",
      generalRecommendations: [
        "Specialize in specific niches or industries",
        "Perfect your negotiation and budget management skills",
        "Develop more sophisticated ROI measurement strategies",
        "Expand your knowledge of emerging trends and new platforms"
      ],
      interviewPreparation: [
        "Highlight campaigns where your contribution was significant",
        "Explain your approach to evaluating campaign success",
        "Share examples of successful negotiations with influencers",
        "Demonstrate knowledge of current market trends"
      ]
    },
    4: {
      title: "Leadership in Influencer Marketing",
      description: "You have a high level of experience. Focus on advanced strategies and leadership.",
      generalRecommendations: [
        "Develop integrated multichannel strategies with influencers",
        "Implement advanced data approaches to optimize campaigns",
        "Lead teams and manage relationships with high-level influencers",
        "Innovate in formats and approaches to creator collaboration"
      ],
      interviewPreparation: [
        "Present detailed case studies of campaigns you've led",
        "Explain your strategic vision for the future of influencer marketing",
        "Highlight your ability to manage crises and complex situations",
        "Show how you've integrated influencers into broader marketing strategies"
      ]
    },
    5: {
      title: "Excellence in Influencer Management",
      description: "You are a reference in the sector. Continue innovating and defining best practices.",
      generalRecommendations: [
        "Develop pioneering strategies in the field",
        "Mentor other professionals and share knowledge",
        "Establish strategic relationships with leading industry influencers",
        "Participate in defining industry standards and best practices"
      ],
      interviewPreparation: [
        "Position yourself as a thought leader with innovative ideas",
        "Explain how you've transformed entire teams or departments",
        "Highlight high-impact collaborations with recognized influencers",
        "Demonstrate your vision for evolving the role of influencers in marketing"
      ]
    }
  };

  return recommendationMap[level] || recommendationMap[1];
}

export async function GET(request) {
  try {
    const response_id = request.headers.get('response-id') || request.headers.get('response_id');
    console.log('GET request received with ID:', response_id);
    
    if (!response_id) {
      console.log('No response ID provided in headers');
      return NextResponse.json({ 
        error: 'Missing response ID'
      }, { status: 400 });
    }

    // Get results from database
    const result = await getAssessmentResultByResponseId(response_id);
    
    console.log('Returning result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ 
      error: 'Error fetching results',
      details: error.message
    }, { status: 500 });
  }
}
