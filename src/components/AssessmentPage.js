import React from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart, Users, Brain, Code, Heart, Target, MessageCircle } from 'lucide-react';

// Custom button component
const PrimaryButton = ({ children, onClick, className = "" }) => {
  return (
    <Button 
      className={`
        group relative
        bg-blue-600 hover:bg-blue-700 
        text-white 
        px-8 py-6 
        text-lg 
        rounded-lg
        font-semibold
        flex items-center gap-3
        transition-all
        ${className}
      `}
      onClick={onClick}
    >
      {children}
      <div className="
        w-10 h-10 
        rounded-full 
        bg-white 
        flex items-center justify-center
        group-hover:bg-gray-100
      ">
        <ArrowRight className="w-5 h-5 text-blue-600" />
      </div>
    </Button>
  );
};

// Component for capability dimension
const CapabilityDimension = ({ icon: Icon, title, description }) => {
  return (
    <Card className="border-2 border-gray-100 hover:border-blue-400 transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-blue-600 p-4 mb-4">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for numbered feature
const NumberedFeature = ({ number, title, description }) => {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="rounded-full bg-blue-600 w-12 h-12 flex items-center justify-center">
          <span className="text-white text-xl font-bold">{number}</span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// Component for process step
const ProcessStep = ({ number, title, description }) => {
  return (
    <Card className="p-6 border-2 border-gray-100 hover:border-blue-400 transition-colors h-full">
      <CardContent className="pt-6">
        <div className="rounded-full bg-blue-600 w-12 h-12 flex items-center justify-center mb-4">
          <span className="text-white text-xl font-bold">{number}</span>
        </div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

// Card with impact stats/metrics
const ImpactCard = ({ title, stat, description }) => {
  return (
    <Card className="border-2 border-gray-100 hover:border-blue-600 transition-all hover:shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-blue-800">{title}</h3>
        <p className="text-4xl font-bold text-blue-600 mb-2">{stat}</p>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const AssessmentPage = () => {
  const capabilities = [
    {
      icon: BarChart,
      title: "Strategic Influencer Selection",
      description: "Ability to identify influencers whose values align with the brand, evaluate their audience, and verify their authenticity."
    },
    {
      icon: MessageCircle,
      title: "Content and Campaign Management",
      description: "Capacity to create effective briefings, balance brand control with authenticity, and coordinate multi-influencer campaigns."
    },
    {
      icon: Users,
      title: "Audience Understanding",
      description: "Analyzing engagement patterns, effective segmentation, and evaluation of emotional resonance of content with different audiences."
    },
    {
      icon: Heart,
      title: "Authenticity Cultivation",
      description: "Ability to foster genuine connections, manage authenticity perception, and handle commercial transparency appropriately."
    },
    {
      icon: Target,
      title: "Analysis and Optimization",
      description: "Definition of relevant KPIs, effective attribution models, and capacity to extract actionable insights from campaign data."
    },
    {
      icon: Code,
      title: "Digital Ecosystem Adaptability",
      description: "Monitoring trends, experimenting with new platforms, and ability to quickly adapt to disruptive changes in the social landscape."
    },
    {
      icon: Brain,
      title: "Relationship Management",
      description: "Effective communication, shared value negotiation, long-term relationship development, and constructive conflict resolution."
    }
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-8 leading-tight">
              Assess Your Influencer Manager Capabilities
            </h1>
            <p className="text-xl mb-12 text-blue-100 leading-relaxed">
              Discover your strengths and areas for improvement as an Influencer Manager with our assessment based on a comprehensive framework of 7 key dimensions for success in influencer marketing.
            </p>
            <PrimaryButton onClick={() => window.location.href = '/assessment'}>
              Start Assessment
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              The Impact of an Effective Influencer Manager
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <ImpactCard 
                title="Engagement" 
                stat="+34%" 
                description="Higher engagement in campaigns managed by experienced professionals"
              />
              <ImpactCard 
                title="ROI" 
                stat="+42%" 
                description="Better return on investment in strategic collaborations"
              />
              <ImpactCard 
                title="Reach" 
                stat="3x" 
                description="Greater effective reach with optimized strategies"
              />
              <ImpactCard 
                title="Conversions" 
                stat="+28%" 
                description="More conversions with relevant and well-aligned partnerships"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Dimensions Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                The 7 Dimensions of an Effective Influencer Manager
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our assessment evaluates the critical professional capabilities necessary for success in influencer management.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((capability, index) => (
                <CapabilityDimension
                  key={index}
                  icon={capability.icon}
                  title={capability.title}
                  description={capability.description}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              What You'll Get From This Assessment
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <NumberedFeature 
                number="1"
                title="Comprehensive Professional Profile" 
                description="Detailed evaluation of your current capabilities as an Influencer Manager."
              />
              <NumberedFeature 
                number="2"
                title="Interview Preparation" 
                description="Specific recommendations to stand out in your next job interview."
              />
              <NumberedFeature 
                number="3"
                title="Development Resources" 
                description="Personalized suggestions of courses, tools, and resources to improve."
              />
              <NumberedFeature 
                number="4"
                title="Growth Plan" 
                description="Clear roadmap to become an elite Influencer Manager."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Process Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              How It Works
            </h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <ProcessStep 
                number="1" 
                title="Assessment"
                description="Complete our specialized questionnaire designed to evaluate the key capabilities of an Influencer Manager."
              />
              <ProcessStep 
                number="2" 
                title="Analysis"
                description="Our system analyzes your responses using industry benchmarks and current best practices."
              />
              <ProcessStep 
                number="3" 
                title="Results & Preparation"
                description="Receive a detailed report with specific advice to highlight your strengths in your next job interview."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interview Preparation Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">
                Job Interview Preparation
              </h2>
              <p className="text-lg mb-6">
                This tool is specifically designed to help you prepare for job interviews as an Influencer Manager, highlighting your strengths and preparing you to address your areas for improvement.
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Additional Benefits:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-900"></div>
                    <span>The interviewer will receive a report with recommended questions based on your profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-900"></div>
                    <span>You'll receive response suggestions to highlight your strengths</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-900"></div>
                    <span>You'll know in advance the areas where the interviewer might dig deeper</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Stand Out in Your Next Interview?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start your assessment today and receive personalized insights to become an elite Influencer Manager.
            </p>
            <PrimaryButton onClick={() => window.location.href = '/assessment'}>
              Start Assessment
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssessmentPage;
