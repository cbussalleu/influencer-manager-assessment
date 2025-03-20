'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';
import { ArrowRight, BookOpen, Download, ExternalLink, BarChart, Users, Brain, Code, Heart, Target, MessageCircle } from 'lucide-react';

// Radar chart to visualize dimensions
const RadarChart = ({ scores, labels }) => {
  // This is a simplified visualization using CSS transformations
  // For a more sophisticated radar chart, Recharts could be used
  
  const sides = scores.length;
  const angle = (2 * Math.PI) / sides;
  const center = 100;
  const radius = 80;
  
  return (
    <div className="w-full max-w-md mx-auto relative h-80">
      {/* Background circle */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-2 border-gray-200 opacity-30"></div>
        <div className="w-64 h-64 rounded-full border-2 border-gray-200 opacity-30 absolute"></div>
        <div className="w-80 h-80 rounded-full border-2 border-gray-200 opacity-30 absolute"></div>
      </div>
      
      {/* Axis lines */}
      {labels.map((_, i) => {
        const x = center + radius * Math.sin(i * angle);
        const y = center - radius * Math.cos(i * angle);
        return (
          <div key={`axis-${i}`} className="absolute top-0 left-0 h-0.5 bg-gray-300 origin-left"
            style={{
              width: `${radius}px`,
              left: `${center}px`,
              top: `${center}px`,
              transform: `rotate(${i * (360 / sides)}deg)`
            }}
          ></div>
        );
      })}
      
      {/* Score polygon */}
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 200">
        <polygon 
          points={scores.map((score, i) => {
            const percent = score / 100;
            const x = center + radius * percent * Math.sin(i * angle);
            const y = center - radius * percent * Math.cos(i * angle);
            return `${x},${y}`;
          }).join(' ')}
          fill="rgba(30, 64, 175, 0.3)"
          stroke="#0026df"
          strokeWidth="2"
        />
      </svg>
      
      {/* Labels */}
      {labels.map((label, i) => {
        const percent = 1.2; // Label position beyond the radius
        const x = center + radius * percent * Math.sin(i * angle);
        const y = center - radius * percent * Math.cos(i * angle);
        return (
          <div key={`label-${i}`} className="absolute transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              maxWidth: '80px',
              textAlign: 'center'
            }}
          >
            {label}
          </div>
        );
      })}
      
      {/* Score points */}
      {scores.map((score, i) => {
        const percent = score / 100;
        const x = center + radius * percent * Math.sin(i * angle);
        const y = center - radius * percent * Math.cos(i * angle);
        return (
          <div key={`point-${i}`} 
            className="absolute w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${x}px`,
              top: `${y}px`,
            }}
          ></div>
        );
      })}
    </div>
  );
};

// Component for recommended resources
const ResourceCard = ({ title, type, link, description }) => {
  const getIcon = () => {
    switch(type) {
      case 'course': return <BookOpen className="w-5 h-5" />;
      case 'book': return <BookOpen className="w-5 h-5" />;
      case 'tool': return <Code className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };
  
  return (
    <Card className="p-4 hover:shadow-md transition-all">
      <CardContent className="p-0">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            {getIcon()}
          </div>
          <div>
            <h4 className="font-semibold text-blue-900">{title}</h4>
            <p className="text-sm text-gray-500 mb-2">{type}</p>
            <p className="text-sm">{description}</p>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 text-sm font-medium flex items-center gap-1 mt-2 hover:text-blue-800"
            >
              View resource <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component to display a dimension with its score
const DimensionScore = ({ icon: Icon, title, score, description }) => {
  return (
    <Card className="p-5 hover:shadow-md transition-all border-l-4 border-l-blue-600">
      <CardContent className="p-0">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-lg p-3">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{title}</h3>
              <span className="text-2xl font-bold text-blue-600">{score.toFixed(1)}%</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for mastery level
const MasteryLevelCard = ({ level, description, recommendations }) => {
  const getLevelColor = () => {
    switch(level) {
      case 1: return 'bg-gray-100 text-gray-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-green-100 text-green-800';
      case 4: return 'bg-yellow-100 text-yellow-800';
      case 5: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getLevelName = () => {
    switch(level) {
      case 1: return 'Basic';
      case 2: return 'Developing';
      case 3: return 'Competent';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Undetermined';
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className={`p-4 ${getLevelColor()}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Mastery Level</h3>
          <span className="px-3 py-1 rounded-full bg-white text-sm font-bold">
            Level {level} - {getLevelName()}
          </span>
        </div>
      </div>
      <CardContent>
        <p className="text-lg font-semibold mb-3">{description}</p>
        <p className="text-gray-600 mb-4">{recommendations}</p>
      </CardContent>
    </Card>
  );
};

// Function to get interview questions for dimension (English version)
function getInterviewQuestionsForDimension(dimensionIndex, type) {
  const questionsBank = {
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
  
  return questionsBank[dimensionIndex]?.[type] || [];
}

// Function to get a collection of 10 sample interview questions
function getSampleInterviewQuestions(dimensionScores) {
  let allQuestions = [];
  
  // First, get questions from areas of strength
  dimensionScores.forEach((score, index) => {
    if (score >= 70) {
      const questions = getInterviewQuestionsForDimension(index, 'strengths');
      if (questions.length > 0) {
        allQuestions.push(...questions.map(q => ({
          dimension: index,
          question: q
        })));
      }
    }
  });
  
  // If we don't have enough from strengths, add some from weaknesses
  if (allQuestions.length < 10) {
    dimensionScores.forEach((score, index) => {
      if (score < 60) {
        const questions = getInterviewQuestionsForDimension(index, 'weaknesses');
        if (questions.length > 0) {
          allQuestions.push(...questions.map(q => ({
            dimension: index,
            question: q
          })));
        }
      }
    });
  }
  
  // Shuffle and take the first 10
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}

function Results() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const searchParams = useSearchParams();

  // Dimensions with their icons and descriptions
  const dimensions = [
    {
      icon: BarChart,
      title: "Strategic Influencer Selection",
      description: "Ability to identify influencers aligned with brand values, audience analysis, and authenticity verification."
    },
    {
      icon: MessageCircle,
      title: "Content & Campaign Management",
      description: "Briefing development, balance between control and authenticity, campaign coordination, and multichannel integration."
    },
    {
      icon: Users,
      title: "Audience Understanding",
      description: "Engagement analysis, segmentation, understanding of cultural contexts, and measurement of emotional resonance."
    },
    {
      icon: Heart,
      title: "Authenticity Cultivation",
      description: "Commercial transparency, intrinsic motivation, perception management, and controversy handling."
    },
    {
      icon: Target,
      title: "Analysis & Optimization",
      description: "KPI definition, attribution, data analysis, and continuous improvement based on learnings."
    },
    {
      icon: Code,
      title: "Digital Ecosystem Adaptability",
      description: "Trend monitoring, experimentation, adaptation speed, and technological vision."
    },
    {
      icon: Brain,
      title: "Relationship Management",
      description: "Effective communication, negotiation, long-term relationship development, and conflict resolution."
    }
  ];

  // Recommended resources by dimension
  const recommendedResources = {
    0: [ // Strategic Selection
      {
        title: "Brand Management: Aligning Business, Brand and Behavior",
        type: "course",
        link: "https://www.coursera.org/learn/brand",
        description: "London Business School course on brand value alignment."
      },
      {
        title: "Contagious: How to Build Word of Mouth in the Digital Age",
        type: "book",
        link: "https://www.amazon.com/Contagious-Build-Word-Mouth-Digital/dp/1451686579",
        description: "Jonah Berger explores what makes content shareable and valuable."
      }
    ],
    1: [ // Content Management
      {
        title: "Brief Development and Creative Evaluation",
        type: "course",
        link: "https://www.linkedin.com/learning/brief-development-and-creative-evaluation",
        description: "Learn to develop effective briefs that balance guidelines and creativity."
      },
      {
        title: "The End of Marketing: Humanizing Your Brand in the Age of Social Media and AI",
        type: "book",
        link: "https://www.amazon.com/End-Marketing-Humanizing-Brand-Social/dp/0749497572",
        description: "Carlos Gil explores how to humanize brands in the digital era."
      }
    ],
    2: [ // Audience Understanding
      {
        title: "Advanced Digital Marketing Audience Strategy",
        type: "course",
        link: "https://www.udemy.com/course/advanced-digital-marketing-audience-strategy/",
        description: "Advanced strategies to understand and segment digital audiences."
      },
      {
        title: "Audience Analytics",
        type: "tool",
        link: "https://analytics.google.com/analytics/academy/",
        description: "Google Analytics Academy course on advanced audience analysis."
      }
    ],
    3: [ // Authenticity Cultivation
      {
        title: "Digital Ethics",
        type: "course",
        link: "https://www.linkedin.com/learning/digital-marketing-ethics",
        description: "Course on ethics and transparency in digital marketing."
      },
      {
        title: "Authentic: How to Make a Living By Being Yourself",
        type: "book",
        link: "https://www.amazon.com/Authentic-Make-Living-Being-Yourself/dp/1529336503",
        description: "Sarah Staar explores how authenticity is crucial for success."
      }
    ],
    4: [ // Analysis & Optimization
      {
        title: "Marketing Analytics: Setting and Measuring KPIs",
        type: "course",
        link: "https://www.coursera.org/learn/marketing-analytics",
        description: "UC Berkeley course on defining and measuring relevant KPIs."
      },
      {
        title: "Google Analytics Certification",
        type: "course",
        link: "https://analytics.google.com/analytics/academy/",
        description: "Official certification for digital marketing data analysis."
      }
    ],
    5: [ // Digital Adaptability
      {
        title: "Digital Marketing Trends",
        type: "course",
        link: "https://www.udacity.com/course/digital-marketing-nanodegree--nd018",
        description: "Udacity program on emerging trends in digital marketing."
      },
      {
        title: "Experimentation for Improvement",
        type: "course",
        link: "https://www.coursera.org/learn/experimentation",
        description: "University of Virginia - Experimentation and testing in digital environments."
      }
    ],
    6: [ // Relationship Management
      {
        title: "Successful Negotiation: Essential Strategies and Skills",
        type: "course",
        link: "https://www.coursera.org/learn/negotiation-skills",
        description: "University of Michigan course on effective negotiation techniques."
      },
      {
        title: "Never Split the Difference",
        type: "book",
        link: "https://www.amazon.com/Never-Split-Difference-Negotiating-Depended/dp/0062407805",
        description: "Chris Voss shares advanced FBI negotiation techniques."
      }
    ]
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log('Current URL Parameters:', searchParams.toString());
        
        const response_id = searchParams.get('response_id');
        
        if (!response_id) {
          console.log('No response ID found in URL');
          setError('No results identifier found');
          setLoading(false);
          return;
        }

        console.log('Response ID:', response_id);
        
        // Function to attempt loading results with retries
        const tryLoadResults = async (attempts) => {
          console.log(`Attempt ${attempts + 1} to load results for: ${response_id}`);
          
          try {
            const response = await fetch(`/api/results/${response_id}`);
            
            if (response.status === 404) {
              // If results not found, and we can still retry
              if (attempts < 5) {
                console.log(`Results not found. Retrying in 3 seconds...`);
                setLoadingAttempts(attempts + 1);
                // Wait 3 seconds before retrying
                setTimeout(() => tryLoadResults(attempts + 1), 3000);
                return;
              } else {
                // If we've tried too many times, show error
                setError('Results not found after several attempts. Please try again later.');
                setLoading(false);
                return;
              }
            }
            
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Error fetching results:', errorData);
              setError(errorData.error || 'Could not load results');
              setLoading(false);
              return;
            }

            const data = await response.json();
            console.log('Results data from API:', data);
            
            // Format data more robustly
            const processedResults = {
              totalScore: Number(data.totalScore || data.total_score || 0).toFixed(1),
              masteryLevel: data.masteryLevel || 
                (typeof data.mastery_level === 'string' 
                  ? JSON.parse(data.mastery_level) 
                  : { description: 'Not available', level: 0 }),
              dimensionScores: Array.isArray(data.dimensionScores) 
                ? data.dimensionScores 
                : (data.dimension_scores 
                  ? JSON.parse(data.dimension_scores) 
                  : [0, 0, 0, 0, 0, 0, 0]),
              recommendations: data.recommendations || 
                (typeof data.recommendations === 'string' 
                  ? JSON.parse(data.recommendations) 
                  : {
                      title: 'Recommendations',
                      description: 'No recommendations available',
                      generalRecommendations: []
                    }),
              userName: data.userName || data.user_name || '',
              userEmail: data.userEmail || data.user_email || ''
            };

            setResults(processedResults);
            setLoading(false);
          } catch (error) {
            console.error('Error in attempt:', error);
            
            // If we still have attempts available, retry
            if (attempts < 5) {
              console.log(`Error in attempt ${attempts + 1}. Retrying in 3 seconds...`);
              setLoadingAttempts(attempts + 1);
              setTimeout(() => tryLoadResults(attempts + 1), 3000);
            } else {
              setError('An error occurred while loading results after several attempts.');
              setLoading(false);
            }
          }
        };

        // Start the loading process with retries
        tryLoadResults(0);
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred while loading results');
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  // Mock data for demonstration - in production this would come from the API that implements the calculation logic
  // Import the calculation service when available:
  // import { calculateMaturityLevel } from '@/lib/assessmentCalculation';
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !results && !error) {
      // Simulate data loading after 1 second for demonstration
      const timer = setTimeout(() => {
        // In production, this data would come from the backend that implements the calculation logic
        // described in src/lib/assessmentCalculation.js
        
        // The dimensionScores calculation would be done according to specific weights:
        // - For "Strategic Influencer Selection": value_alignment (30%), audience_analysis (25%), etc.
        // - For "Content Management": briefing_development (25%), control_authenticity_balance (30%), etc.
        // - And so on for each skill, as defined in the assessment system documentation

        const mockData = {
          totalScore: 64.5,
          masteryLevel: {
            level: 4,
            description: "Advanced: Advanced level with sophisticated methodologies and proactive approach",
            recommendations: "To reach the expert level, develop innovation and transformational leadership capabilities in influencer marketing"
          },
          dimensionScores: [74, 57, 68, 59, 38, 71, 85],
          userName: "John Smith",
          userEmail: "john.smith@example.com",
          recommendations: {
            title: "Personalized Development Plan",
            description: "Based on your assessment, we have created a development plan focused on your opportunity areas and leveraging your strengths.",
            generalRecommendations: [
              "Prioritize developing advanced analytical capabilities to improve attribution and ROI",
              "Strengthen the omnichannel integration of your influencer campaigns",
              "Implement a personalized framework to evaluate authenticity",
              "Leverage your exceptional relationship management capability to create long-term ambassador programs"
            ]
          }
        };
        setResults(mockData);
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [results, error]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-8"></div>
        <div className="text-2xl font-bold text-blue-900 mb-4 text-center">Loading your results...</div>
        <div className="text-gray-600 max-w-md text-center mb-2">
          {loadingAttempts > 0 ? 
            `We're processing your assessment. Attempt ${loadingAttempts} of 6...` : 
            'We are analyzing your responses to generate personalized recommendations.'}
        </div>
        <div className="text-sm text-gray-500 max-w-md text-center">
          This process may take a moment. Please do not close this window.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-2xl text-red-600 font-bold mb-4 text-center">{error}</div>
        <p className="text-gray-600 max-w-md text-center mb-8">
          Sorry, we couldn't load your results. This may be because the data is still being processed or due to a technical issue.
        </p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
        <Button 
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-2xl font-bold text-gray-800 mb-4 text-center">No results found</div>
        <p className="text-gray-600 max-w-md text-center mb-8">
          We couldn't find results for the requested assessment. The link may be invalid or the data may have been deleted.
        </p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          onClick={() => window.location.href = '/assessment'}
        >
          Take New Assessment
        </Button>
        <Button 
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  const dimensionNames = dimensions.map(d => d.title);
  
  // Get sample interview questions for the interview preparation section
  const sampleQuestions = getSampleInterviewQuestions(results.dimensionScores);

  // Function to determine the competency level of each dimension
  const getDimensionLevel = (score) => {
    if (score <= 20) return { level: 1, name: "Basic" };
    if (score <= 40) return { level: 2, name: "Developing" };
    if (score <= 60) return { level: 3, name: "Competent" };
    if (score <= 80) return { level: 4, name: "Advanced" };
    return { level: 5, name: "Expert" };
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Header with total score */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {results?.userName && results.userName !== 'Anonymous User' 
                  ? `${results.userName}'s Capability Assessment Results` 
                  : 'Your Capability Assessment Results'}
              </h1>
              <p className="text-xl text-blue-100">Analysis based on the 7 key dimensions framework for Influencer Marketing</p>
            </div>
            
            <Card className="bg-white text-blue-900">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-semibold mb-1">Total Score</h2>
                    <div className="text-6xl font-bold text-blue-600">{results.totalScore}%</div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Mastery Level: {results.masteryLevel.description.split(':')[0]}</h3>
                    <p className="text-gray-600 mb-4">{results.masteryLevel.recommendations}</p>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold text-gray-700">
                          Basic
                        </div>
                        <div className="text-xs font-semibold text-blue-700">
                          Expert
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                        <div style={{ width: `${results.totalScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-gray-500 via-blue-500 to-purple-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main content with tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Navigation tabs */}
            <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
              <button 
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${activeTab === 'dimensions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('dimensions')}
              >
                Detailed Dimensions
              </button>
              <button 
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${activeTab === 'interview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('interview')}
              >
                Interview Preparation
              </button>
              <button 
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${activeTab === 'resources' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('resources')}
              >
                Resources
              </button>
            </div>
            
            {/* Tab contents */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Capabilities Analysis</h2>
                
                <div className="mb-10">
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <RadarChart 
                        scores={results.dimensionScores}
                        labels={dimensionNames.map(name => name.split(' ')[0])}
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <MasteryLevelCard 
                  level={results.masteryLevel.level}
                  description={results.masteryLevel.description}
                  recommendations={results.masteryLevel.recommendations}
                />
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Your Strengths & Opportunities</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-bold text-green-600 mb-3">Strengths</h4>
                        <ul className="space-y-2">
                          {results.dimensionScores.map((score, idx) => {
                            if (score >= 70) {
                              return (
                                <li key={`strength-${idx}`} className="flex items-start gap-2">
                                  <div className="mt-1 w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                  <span><strong>{dimensionNames[idx]}</strong>: {score.toFixed(1)}% - {getDimensionLevel(score).name}</span>
                                </li>
                              );
                            }
                            return null;
                          })}
                          {results.dimensionScores.filter(score => score >= 70).length === 0 && (
                            <li className="text-gray-500 italic">Keep working on developing your capabilities. You're on the right track!</li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-bold text-orange-600 mb-3">Improvement Opportunities</h4>
                        <ul className="space-y-2">
                          {results.dimensionScores.map((score, idx) => {
                            if (score < 60) {
                              return (
                                <li key={`opportunity-${idx}`} className="flex items-start gap-2">
                                  <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                                  <span><strong>{dimensionNames[idx]}</strong>: {score.toFixed(1)}% - {getDimensionLevel(score).name}</span>
                                </li>
                              );
                            }
                            return null;
                          })}
                          {results.dimensionScores.filter(score => score < 60).length === 0 && (
                            <li className="text-gray-500 italic">Congratulations! You've achieved at least Competent level in all dimensions.</li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'dimensions' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Detailed Analysis by Dimension</h2>
                <div className="space-y-6">
                  {dimensions.map((dimension, idx) => (
                    <DimensionScore 
                      key={`dim-${idx}`}
                      icon={dimension.icon}
                      title={dimension.title}
                      score={results.dimensionScores[idx]}
                      description={dimension.description}
                    />
                  ))}
                </div>
                
                <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Maturity Levels</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-gray-600 font-semibold mb-1">Level 1: Basic (0-20%)</div>
                      <p className="text-sm">Reactive approach, minimal processes, and use of surface metrics</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-blue-600 font-semibold mb-1">Level 2: Developing (21-40%)</div>
                      <p className="text-sm">Basic processes established but without consistent methodology</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-green-600 font-semibold mb-1">Level 3: Competent (41-60%)</div>
                      <p className="text-sm">Efficient systems that balance key aspects with consistent results</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-yellow-600 font-semibold mb-1">Level 4: Advanced (61-80%)</div>
                      <p className="text-sm">Proactive management with sophisticated approaches and predictive capacity</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-purple-600 font-semibold mb-1">Level 5: Expert (81-100%)</div>
                      <p className="text-sm">Complete mastery with continuous innovation and transformational leadership</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'interview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Interview Preparation</h2>
                
                {/* General Tips Section */}
                <Card className="mb-8 bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">General Tips</h3>
                    <div className="space-y-4">
                      <p className="text-lg">
                        During your interview, you'll need to demonstrate the strengths you've claimed in this self-assessment.
                        The following tips will help you prepare effectively:
                      </p>
                      <div className="p-4 bg-white rounded-lg">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <span>Prepare concrete examples that demonstrate your strengths in the areas where you scored highest.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <span>Reflect on your development plan for improvement areas and be ready to explain how you intend to address them.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <span>Research the latest trends in influencer marketing to demonstrate your interest and industry knowledge.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <span>Use the STAR method (Situation, Task, Action, Result) to structure your responses to behavioral questions.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <span>Prepare questions that demonstrate your strategic thinking and understanding of the company's influencer marketing goals.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Sample Interview Questions Section */}
                <Card className="mb-6 bg-yellow-50 border-yellow-200">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Sample Interview Questions</h3>
                    <p className="text-lg mb-4">
                      Based on your assessment results, here are 10 questions you might be asked during your interview:
                    </p>
                    
                    <div className="space-y-4 mt-6">
                      {sampleQuestions.map((item, index) => (
                        <div key={`question-${index}`} className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                          <p className="font-medium">{index + 1}. {item.question}</p>
                          <p className="text-sm text-gray-600 mt-1">Dimension: {dimensions[item.dimension].title}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-blue-100 rounded-lg">
                      <h4 className="font-bold mb-2">Preparation Strategy:</h4>
                      <p className="mb-3">
                        For each question above:
                      </p>
                      <ol className="list-decimal ml-5 space-y-2">
                        <li>Write down specific examples from your experience</li>
                        <li>Practice your answers aloud to ensure clarity and conciseness</li>
                        <li>Prepare supporting evidence to back up your claims</li>
                        <li>Consider how your approach aligns with the company's brand and values</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === 'resources' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Recommended Resources</h2>
                
                <div className="mb-8">
                  <p className="text-lg mb-4">
                    Based on your results, we've selected specific resources that will help you develop your professional capabilities as an Influencer Manager.
                  </p>
                </div>
                
                {/* Specific Recommendations by Dimension (moved from Recommendations tab) */}
                <div className="mt-8 mb-10">
                  <h3 className="text-xl font-bold mb-4">Specific Recommendations by Dimension</h3>
                  <div className="space-y-6">
                    {dimensions.map((dimension, idx) => {
                      const score = results.dimensionScores[idx];
                      let specificRecs = [];
                      
                      if (score < 40) {
                        specificRecs = [
                          "Establish a fundamental training plan in this area",
                          "Seek mentors specialized in this dimension",
                          "Start with small supervised projects to gain experience"
                        ];
                      } else if (score < 70) {
                        specificRecs = [
                          "Deepen your knowledge in specific aspects of this dimension",
                          "Look for projects where you can develop these capabilities",
                          "Consider specialized training to reach advanced level"
                        ];
                      } else {
                        specificRecs = [
                          "Share your knowledge with other professionals",
                          "Look to innovate and develop new approaches in this area",
                          "Consider leading initiatives or creating training content"
                        ];
                      }
                      
                      return (
                        <Card key={`rec-${idx}`} className="border-l-4 border-l-blue-600">
                          <CardContent className="p-6">
                            <h4 className="text-lg font-bold mb-2">{dimension.title} ({score.toFixed(1)}%)</h4>
                            <ul className="space-y-2">
                              {specificRecs.map((rec, recIdx) => (
                                <li key={`rec-${idx}-${recIdx}`} className="flex items-start gap-2">
                                  <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                
                {/* Prioritize dimensions with low scores */}
                {dimensions.map((dimension, idx) => {
                  // Show resources with emphasis on dimensions with scores under 70%
                  const priorityOrder = results.dimensionScores[idx] < 60 ? "high" :
                                        results.dimensionScores[idx] < 70 ? "medium" : "low";
                  
                  return (
                    <div key={`res-section-${idx}`} className="mb-8">
                      <div className="flex items-center mb-4">
                        <h3 className="text-xl font-bold mr-3">{dimension.title}</h3>
                        {priorityOrder === "high" && (
                          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">High Priority</span>
                        )}
                        {priorityOrder === "medium" && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">Medium Priority</span>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(recommendedResources[idx] || []).map((resource, resIdx) => (
                          <ResourceCard 
                            key={`res-${idx}-${resIdx}`}
                            title={resource.title}
                            type={resource.type}
                            link={resource.link}
                            description={resource.description}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 text-blue-800">Personalized Development Plan</h3>
                  <p className="mb-4">
                    To maximize your professional growth, we recommend:
                  </p>
                  <ol className="space-y-2 ml-5 list-decimal">
                    <li className="ml-2">Identify 2-3 priority dimensions based on your results</li>
                    <li className="ml-2">Select specific resources for each of these dimensions</li>
                    <li className="ml-2">Establish SMART objectives for your professional development</li>
                    <li className="ml-2">Seek a mentor specialized in influencer marketing</li>
                    <li className="ml-2">Review your progress every 3-6 months</li>
                  </ol>
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="mt-12 flex flex-wrap gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                onClick={() => window.print()}
              >
                <Download className="w-5 h-5" />
                Download Results
              </Button>
              <Button 
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    }>
      <Results />
    </Suspense>
  );
}
