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
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Capability Assessment Results</h1>
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
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('recommendations')}
              >
                Recommendations
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
            
            {activeTab === 'recommendations' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{results.recommendations.title}</h2>
                <Card className="mb-8 bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <p className="text-lg mb-6">{results.recommendations.description}</p>
                    <div className="space-y-4">
                      {results.recommendations.generalRecommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="rounded-full bg-blue-600 w-8 h-8 flex items-center justify-center text-white">
                              {index + 1}
                            </div>
                          </div>
                          <p className="text-lg">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-8">
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
