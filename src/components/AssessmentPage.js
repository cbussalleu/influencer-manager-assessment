import React from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart, Users, Brain, Code, Heart, Target, MessageCircle } from 'lucide-react';

// Custom component for the button
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

// Component for a capability dimension
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

// Component for a numbered feature
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
      title: "Content & Campaign Management",
      description: "Capability to create effective briefs, balance brand control with authenticity, and coordinate multi-influencer campaigns."
    },
    {
      icon: Users,
      title: "Audience Understanding",
      description: "Analysis of engagement, effective segmentation, and evaluation of emotional resonance of content with different audiences."
    },
    {
      icon: Heart,
      title: "Authenticity Cultivation",
      description: "Ability to foster genuine connections, manage authenticity perception, and properly handle commercial transparency."
    },
    {
      icon: Target,
      title: "Analysis & Optimization",
      description: "Definition of relevant KPIs, effective attribution models, and ability to extract actionable insights from data."
    },
    {
      icon: Code,
      title: "Digital Ecosystem Adaptability",
      description: "Trend monitoring, experimentation with new platforms, and ability to quickly adapt to disruptive changes."
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
              Evaluate Your Influencer Manager Capabilities
            </h1>
            <p className="text-xl mb-12 text-blue-100 leading-relaxed">
              Discover your strengths and areas for improvement as an Influencer Manager with our assessment based on a comprehensive framework of 7 key dimensions for success.
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
                description="Better return on investment through advanced selection strategies"
              />
              <ImpactCard 
                title="Authenticity" 
                stat="3x" 
                description="Greater perception of authenticity and trust in brand messaging"
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
                Our assessment evaluates the critical professional capabilities for success in influencer management based on a comprehensive framework developed by experts.
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
              What Will You Get From This Assessment?
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <NumberedFeature 
                number="1"
                title="Complete Professional Profile" 
                description="Detailed evaluation of your current capabilities as an Influencer Manager with maturity level for each dimension."
              />
              <NumberedFeature 
                number="2"
                title="Strengths & Development Areas Analysis" 
                description="Precise identification of your strong points and specific opportunities for improvement."
              />
              <NumberedFeature 
                number="3"
                title="Personalized Development Resources" 
                description="Recommendations of courses, tools, and resources tailored to your profile to enhance your career."
              />
              <NumberedFeature 
                number="4"
                title="Professional Growth Plan" 
                description="Clear roadmap to evolve towards advanced levels in each key dimension."
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
              How Does It Work?
            </h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <ProcessStep 
                number="1" 
                title="Assessment"
                description="Complete our specialized questionnaire designed to evaluate the 7 key dimensions for success in influencer marketing."
              />
              <ProcessStep 
                number="2" 
                title="Analysis"
                description="Our system analyzes your responses using a maturity model developed by experts in the field."
              />
              <ProcessStep 
                number="3" 
                title="Results"
                description="Receive a detailed report with your maturity level in each dimension, strengths, development areas, and personalized recommendations."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Levels of Maturity Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">
                Maturity Levels
              </h2>
              <p className="text-lg mb-6">
                Our assessment classifies each dimension into five maturity levels, allowing you to precisely identify your stage of professional development.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold">Level 1</div>
                  <div>
                    <h3 className="font-bold">Basic (0-20%)</h3>
                    <p className="text-gray-600">Reactive and tactical approach with minimal established processes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-200 px-3 py-1 rounded-full text-sm font-semibold">Level 2</div>
                  <div>
                    <h3 className="font-bold">Developing (21-40%)</h3>
                    <p className="text-gray-600">Basic processes and recognition of importance, without consistent methodology</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-200 px-3 py-1 rounded-full text-sm font-semibold">Level 3</div>
                  <div>
                    <h3 className="font-bold">Competent (41-60%)</h3>
                    <p className="text-gray-600">Effective established systems with consistent processes and predictable results</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-200 px-3 py-1 rounded-full text-sm font-semibold">Level 4</div>
                  <div>
                    <h3 className="font-bold">Advanced (61-80%)</h3>
                    <p className="text-gray-600">Proactive and strategic approach with sophisticated systems and predictive capacity</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-200 px-3 py-1 rounded-full text-sm font-semibold">Level 5</div>
                  <div>
                    <h3 className="font-bold">Expert (81-100%)</h3>
                    <p className="text-gray-600">Complete mastery with innovation capacity, leadership, and field transformation</p>
                  </div>
                </div>
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
              Ready to Discover Your Level as an Influencer Manager?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start your assessment today and receive a personalized analysis with specific recommendations to boost your professional career.
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
