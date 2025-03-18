import React from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart, Users, Brain, Code, Heart, Target } from 'lucide-react';

// Componente personalizado para el botón
const PrimaryButton = ({ children, onClick, className = "" }) => {
  return (
    <Button 
      className={`
        group relative
        bg-purple-600 hover:bg-purple-700 
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
        <ArrowRight className="w-5 h-5 text-purple-600" />
      </div>
    </Button>
  );
};

// Componente para una dimensión de capacidad
const CapabilityDimension = ({ icon: Icon, title, description }) => {
  return (
    <Card className="border-2 border-gray-100 hover:border-purple-400 transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-purple-600 p-4 mb-4">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para una característica con número
const NumberedFeature = ({ number, title, description }) => {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="rounded-full bg-purple-600 w-12 h-12 flex items-center justify-center">
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

// Componente para paso del proceso
const ProcessStep = ({ number, title, description }) => {
  return (
    <Card className="p-6 border-2 border-gray-100 hover:border-purple-400 transition-colors h-full">
      <CardContent className="pt-6">
        <div className="rounded-full bg-purple-600 w-12 h-12 flex items-center justify-center mb-4">
          <span className="text-white text-xl font-bold">{number}</span>
        </div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

// Card con stats/métricas de impacto
const ImpactCard = ({ title, stat, description }) => {
  return (
    <Card className="border-2 border-gray-100 hover:border-purple-600 transition-all hover:shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-purple-800">{title}</h3>
        <p className="text-4xl font-bold text-purple-600 mb-2">{stat}</p>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

const AssessmentPage = () => {
  const capabilities = [
    {
      icon: Users,
      title: "Gestión de Relaciones con Influencers",
      description: "Habilidad para identificar, contactar y mantener relaciones productivas con influencers y creadores de contenido."
    },
    {
      icon: BarChart,
      title: "Conocimiento de Marketing Digital",
      description: "Comprensión de ecosistemas digitales, plataformas sociales, SEO y estrategias de marketing de contenidos."
    },
    {
      icon: Brain,
      title: "Análisis y Métricas",
      description: "Capacidad para evaluar métricas, medir resultados de campañas y determinar ROI de colaboraciones con influencers."
    },
    {
      icon: Code,
      title: "Negociación y Contratos",
      description: "Habilidad para estructurar acuerdos, negociar términos favorables y gestionar aspectos legales de colaboraciones."
    },
    {
      icon: Target,
      title: "Gestión de Campañas",
      description: "Planificación, ejecución y coordinación de campañas multicanal con múltiples influencers y stakeholders."
    },
    {
      icon: Heart,
      title: "Comunicación Estratégica",
      description: "Habilidad para alinear mensajes de marca con el estilo de influencers y gestionar comunicación de crisis."
    }
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-8 leading-tight">
              Evalúa tus capacidades como Influencer Manager
            </h1>
            <p className="text-xl mb-12 text-purple-100 leading-relaxed">
              Descubre tus fortalezas y áreas de mejora como Influencer Manager y prepárate para destacar en tu próxima entrevista de trabajo.
            </p>
            <PrimaryButton onClick={() => window.location.href = '/assessment'}>
              Iniciar Evaluación
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              El impacto de un buen Influencer Manager
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <ImpactCard 
                title="Engagement" 
                stat="+34%" 
                description="Mayor engagement en campañas gestionadas por profesionales experimentados"
              />
              <ImpactCard 
                title="ROI" 
                stat="+42%" 
                description="Mejor retorno de inversión en colaboraciones estratégicas"
              />
              <ImpactCard 
                title="Alcance" 
                stat="3x" 
                description="Mayor alcance efectivo con estrategias optimizadas"
              />
              <ImpactCard 
                title="Conversiones" 
                stat="+28%" 
                description="Más conversiones con partnerships relevantes y bien alineados"
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
                Las 6 dimensiones de un Influencer Manager efectivo
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nuestro assessment evalúa las capacidades profesionales críticas para el éxito en la gestión de influencers.
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
              ¿Qué obtendrás con esta evaluación?
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <NumberedFeature 
                number="1"
                title="Perfil profesional completo" 
                description="Evaluación detallada de tus capacidades actuales como Influencer Manager."
              />
              <NumberedFeature 
                number="2"
                title="Preparación para entrevistas" 
                description="Recomendaciones específicas para destacar en tu próxima entrevista de trabajo."
              />
              <NumberedFeature 
                number="3"
                title="Recursos de desarrollo" 
                description="Sugerencias personalizadas de cursos, herramientas y recursos para mejorar."
              />
              <NumberedFeature 
                number="4"
                title="Plan de crecimiento" 
                description="Hoja de ruta clara para convertirte en un Influencer Manager de élite."
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
              ¿Cómo funciona?
            </h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <ProcessStep 
                number="1" 
                title="Evaluación"
                description="Completa nuestro cuestionario especializado diseñado para evaluar las capacidades clave de un Influencer Manager."
              />
              <ProcessStep 
                number="2" 
                title="Análisis"
                description="Nuestro sistema analiza tus respuestas utilizando benchmarks del sector y mejores prácticas actuales."
              />
              <ProcessStep 
                number="3" 
                title="Resultados & Preparación"
                description="Recibe un informe detallado con consejos específicos para destacar en tu próxima entrevista de trabajo."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interview Preparation Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-purple-50 rounded-xl p-8 border border-purple-100">
              <h2 className="text-3xl font-bold text-purple-900 mb-6">
                Preparación para entrevistas laborales
              </h2>
              <p className="text-lg mb-6">
                Esta herramienta está especialmente diseñada para ayudarte a prepararte para entrevistas de trabajo como Influencer Manager, destacando tus fortalezas y preparándote para abordar tus áreas de mejora.
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Beneficios adicionales:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-900"></div>
                    <span>El entrevistador recibirá un reporte con recomendaciones de preguntas según tu perfil</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-900"></div>
                    <span>Recibirás sugerencias de respuestas para destacar tus puntos fuertes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-900"></div>
                    <span>Conocerás de antemano las áreas donde el entrevistador podría profundizar</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para destacar en tu próxima entrevista?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Inicia tu evaluación hoy y recibe insights personalizados para convertirte en un Influencer Manager de élite.
            </p>
            <PrimaryButton onClick={() => window.location.href = '/assessment'}>
              Iniciar Evaluación
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssessmentPage;
