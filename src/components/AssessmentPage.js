import React from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart, Users, Brain, Code, Heart, Target, MessageCircle } from 'lucide-react';

// Componente personalizado para el botón
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

// Componente para una dimensión de capacidad
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

// Componente para una característica con número
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

// Componente para paso del proceso
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

// Card con stats/métricas de impacto
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
      title: "Selección Estratégica de Influencers",
      description: "Habilidad para identificar influencers cuyos valores se alinean con la marca, evaluar su audiencia y verificar su autenticidad."
    },
    {
      icon: MessageCircle,
      title: "Gestión de Contenido y Campañas",
      description: "Capacidad para crear briefings eficaces, equilibrar control de marca con autenticidad y coordinar campañas multi-influencer."
    },
    {
      icon: Users,
      title: "Comprensión de Audiencias",
      description: "Análisis de engagement, segmentación efectiva y evaluación de la resonancia emocional del contenido con distintas audiencias."
    },
    {
      icon: Heart,
      title: "Cultivo de Autenticidad",
      description: "Habilidad para fomentar conexiones genuinas, gestionar la percepción de autenticidad y manejar adecuadamente la transparencia comercial."
    },
    {
      icon: Target,
      title: "Análisis y Optimización",
      description: "Definición de KPIs relevantes, modelos de atribución efectivos y capacidad para extraer insights accionables de los datos."
    },
    {
      icon: Code,
      title: "Adaptabilidad al Ecosistema Digital",
      description: "Monitoreo de tendencias, experimentación con nuevas plataformas y capacidad para adaptarse rápidamente a cambios disruptivos."
    },
    {
      icon: Brain,
      title: "Gestión de Relaciones",
      description: "Comunicación efectiva, negociación de valor compartido, desarrollo de relaciones a largo plazo y resolución constructiva de conflictos."
    }
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-8 leading-tight">
              Evalúa tus capacidades como Influencer Manager
            </h1>
            <p className="text-xl mb-12 text-blue-100 leading-relaxed">
              Descubre tus fortalezas y áreas de mejora como Influencer Manager con nuestra evaluación basada en un marco integral de 7 dimensiones clave para el éxito en marketing de influencia.
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
              El impacto de un Influencer Manager efectivo
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
                description="Mejor retorno de inversión mediante estrategias de selección avanzadas"
              />
              <ImpactCard 
                title="Autenticidad" 
                stat="3x" 
                description="Mayor percepción de autenticidad y confianza en el mensaje de marca"
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
                Las 7 dimensiones de un Influencer Manager efectivo
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nuestro assessment evalúa las capacidades profesionales críticas para el éxito en la gestión de influencers basado en un marco integral desarrollado por expertos.
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
                description="Evaluación detallada de tus capacidades actuales como Influencer Manager con nivel de madurez para cada dimensión."
              />
              <NumberedFeature 
                number="2"
                title="Análisis de fortalezas y áreas de desarrollo" 
                description="Identificación precisa de tus puntos fuertes y oportunidades específicas de mejora."
              />
              <NumberedFeature 
                number="3"
                title="Recursos de desarrollo personalizados" 
                description="Recomendaciones de cursos, herramientas y recursos adaptados a tu perfil para potenciar tu carrera."
              />
              <NumberedFeature 
                number="4"
                title="Plan de crecimiento profesional" 
                description="Hoja de ruta clara para evolucionar hacia niveles avanzados en cada dimensión clave."
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
                description="Completa nuestro cuestionario especializado diseñado para evaluar las 7 dimensiones clave para el éxito en marketing de influencia."
              />
              <ProcessStep 
                number="2" 
                title="Análisis"
                description="Nuestro sistema analiza tus respuestas utilizando un modelo de madurez desarrollado por expertos en el sector."
              />
              <ProcessStep 
                number="3" 
                title="Resultados"
                description="Recibe un informe detallado con tu nivel de madurez en cada dimensión, fortalezas, áreas de desarrollo y recomendaciones personalizadas."
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
                Niveles de Madurez
              </h2>
              <p className="text-lg mb-6">
                Nuestra evaluación clasifica cada dimensión en cinco niveles de madurez, permitiéndote identificar con precisión tu etapa de desarrollo profesional.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold">Nivel 1</div>
                  <div>
                    <h3 className="font-bold">Básico (0-20%)</h3>
                    <p className="text-gray-600">Enfoque reactivo y táctico con procesos mínimos establecidos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-200 px-3 py-1 rounded-full text-sm font-semibold">Nivel 2</div>
                  <div>
                    <h3 className="font-bold">En desarrollo (21-40%)</h3>
                    <p className="text-gray-600">Procesos básicos y reconocimiento de importancia, sin metodología consistente</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-200 px-3 py-1 rounded-full text-sm font-semibold">Nivel 3</div>
                  <div>
                    <h3 className="font-bold">Competente (41-60%)</h3>
                    <p className="text-gray-600">Sistemas efectivos establecidos con procesos consistentes y resultados predecibles</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-200 px-3 py-1 rounded-full text-sm font-semibold">Nivel 4</div>
                  <div>
                    <h3 className="font-bold">Avanzado (61-80%)</h3>
                    <p className="text-gray-600">Enfoque proactivo y estratégico con sistemas sofisticados y capacidad predictiva</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-200 px-3 py-1 rounded-full text-sm font-semibold">Nivel 5</div>
                  <div>
                    <h3 className="font-bold">Experto (81-100%)</h3>
                    <p className="text-gray-600">Dominio completo con capacidad de innovación, liderazgo y transformación del campo</p>
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
              ¿Listo para descubrir tu nivel como Influencer Manager?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Inicia tu evaluación hoy y recibe un análisis personalizado con recomendaciones específicas para impulsar tu carrera profesional.
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
