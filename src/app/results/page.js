'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';
import { ArrowRight, BookOpen, Download, ExternalLink, BarChart, Users, Brain, Code, Heart, Target, MessageCircle } from 'lucide-react';

// Radar chart para visualizar las dimensiones
const RadarChart = ({ scores, labels }) => {
  // Esta es una visualización simplificada usando transformaciones CSS
  // Para un radar chart más sofisticado, se podría usar Recharts
  
  const sides = scores.length;
  const angle = (2 * Math.PI) / sides;
  const center = 100;
  const radius = 80;
  
  return (
    <div className="w-full max-w-md mx-auto relative h-80">
      {/* Círculo de fondo */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-2 border-gray-200 opacity-30"></div>
        <div className="w-64 h-64 rounded-full border-2 border-gray-200 opacity-30 absolute"></div>
        <div className="w-80 h-80 rounded-full border-2 border-gray-200 opacity-30 absolute"></div>
      </div>
      
      {/* Líneas de los ejes */}
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
      
      {/* Polígono del score */}
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
      
      {/* Etiquetas */}
      {labels.map((label, i) => {
        const percent = 1.2; // Posición de la etiqueta más allá del radio
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
      
      {/* Puntos de los scores */}
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

// Componente para recursos recomendados
const ResourceCard = ({ title, type, link, description }) => {
  const getIcon = () => {
    switch(type) {
      case 'curso': return <BookOpen className="w-5 h-5" />;
      case 'libro': return <BookOpen className="w-5 h-5" />;
      case 'herramienta': return <Code className="w-5 h-5" />;
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
              Ver recurso <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para mostrar una dimensión con su puntuación
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

// Componente para nivel de maestría
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
      case 1: return 'Básico';
      case 2: return 'En desarrollo';
      case 3: return 'Competente';
      case 4: return 'Avanzado';
      case 5: return 'Experto';
      default: return 'No determinado';
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className={`p-4 ${getLevelColor()}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Nivel de Maestría</h3>
          <span className="px-3 py-1 rounded-full bg-white text-sm font-bold">
            Nivel {level} - {getLevelName()}
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

  // Dimensiones con sus iconos y descripciones
  const dimensions = [
    {
      icon: BarChart,
      title: "Selección Estratégica de Influencers",
      description: "Capacidad para identificar influencers alineados con valores de marca, análisis de audiencia y verificación de autenticidad."
    },
    {
      icon: MessageCircle,
      title: "Gestión de Contenido y Campañas",
      description: "Desarrollo de briefings, balance entre control y autenticidad, coordinación de campañas e integración multicanal."
    },
    {
      icon: Users,
      title: "Comprensión de Audiencias",
      description: "Análisis de engagement, segmentación, comprensión de contextos culturales y medición de resonancia emocional."
    },
    {
      icon: Heart,
      title: "Cultivo de Autenticidad",
      description: "Transparencia comercial, motivación intrínseca, gestión de percepción y manejo de controversias."
    },
    {
      icon: Target,
      title: "Análisis y Optimización",
      description: "Definición de KPIs, atribución, análisis de datos y mejora continua basada en aprendizajes."
    },
    {
      icon: Code,
      title: "Adaptabilidad al Ecosistema Digital",
      description: "Monitoreo de tendencias, experimentación, velocidad de adaptación y visión tecnológica."
    },
    {
      icon: Brain,
      title: "Gestión de Relaciones",
      description: "Comunicación efectiva, negociación, desarrollo de relaciones a largo plazo y resolución de conflictos."
    }
  ];

  // Recursos recomendados por dimensión
  const recommendedResources = {
    0: [ // Selección Estratégica
      {
        title: "Brand Management: Aligning Business, Brand and Behavior",
        type: "curso",
        link: "https://www.coursera.org/learn/brand",
        description: "Curso de London Business School sobre alineación de valores de marca."
      },
      {
        title: "Contagious: How to Build Word of Mouth in the Digital Age",
        type: "libro",
        link: "https://www.amazon.com/Contagious-Build-Word-Mouth-Digital/dp/1451686579",
        description: "Jonah Berger explora qué hace que el contenido sea compartido y valorado."
      }
    ],
    1: [ // Gestión de Contenido
      {
        title: "Brief Development and Creative Evaluation",
        type: "curso",
        link: "https://www.linkedin.com/learning/brief-development-and-creative-evaluation",
        description: "Aprende a desarrollar briefings efectivos que equilibran directrices y creatividad."
      },
      {
        title: "The End of Marketing: Humanizing Your Brand in the Age of Social Media and AI",
        type: "libro",
        link: "https://www.amazon.com/End-Marketing-Humanizing-Brand-Social/dp/0749497572",
        description: "Carlos Gil explora cómo humanizar marcas en la era digital."
      }
    ],
    2: [ // Comprensión de Audiencias
      {
        title: "Advanced Digital Marketing Audience Strategy",
        type: "curso",
        link: "https://www.udemy.com/course/advanced-digital-marketing-audience-strategy/",
        description: "Estrategias avanzadas para comprender y segmentar audiencias digitales."
      },
      {
        title: "Audience Analytics",
        type: "herramienta",
        link: "https://analytics.google.com/analytics/academy/",
        description: "Curso de Google Analytics Academy sobre análisis avanzado de audiencias."
      }
    ],
    3: [ // Cultivo de Autenticidad
      {
        title: "Digital Ethics",
        type: "curso",
        link: "https://www.linkedin.com/learning/digital-marketing-ethics",
        description: "Curso sobre ética y transparencia en marketing digital."
      },
      {
        title: "Authentic: How to Make a Living By Being Yourself",
        type: "libro",
        link: "https://www.amazon.com/Authentic-Make-Living-Being-Yourself/dp/1529336503",
        description: "Sarah Staar explora cómo la autenticidad es crucial para el éxito."
      }
    ],
    4: [ // Análisis y Optimización
      {
        title: "Marketing Analytics: Setting and Measuring KPIs",
        type: "curso",
        link: "https://www.coursera.org/learn/marketing-analytics",
        description: "Curso de UC Berkeley sobre definición y medición de KPIs relevantes."
      },
      {
        title: "Google Analytics Certification",
        type: "curso",
        link: "https://analytics.google.com/analytics/academy/",
        description: "Certificación oficial para análisis de datos de marketing digital."
      }
    ],
    5: [ // Adaptabilidad Digital
      {
        title: "Digital Marketing Trends",
        type: "curso",
        link: "https://www.udacity.com/course/digital-marketing-nanodegree--nd018",
        description: "Programa de Udacity sobre tendencias emergentes en marketing digital."
      },
      {
        title: "Experimentation for Improvement",
        type: "curso",
        link: "https://www.coursera.org/learn/experimentation",
        description: "Universidad de Virginia - Experimentación y pruebas en entornos digitales."
      }
    ],
    6: [ // Gestión de Relaciones
      {
        title: "Successful Negotiation: Essential Strategies and Skills",
        type: "curso",
        link: "https://www.coursera.org/learn/negotiation-skills",
        description: "Curso de la Universidad de Michigan sobre técnicas de negociación eficaz."
      },
      {
        title: "Never Split the Difference",
        type: "libro",
        link: "https://www.amazon.com/Never-Split-Difference-Negotiating-Depended/dp/0062407805",
        description: "Chris Voss comparte técnicas de negociación avanzadas del FBI."
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
          setError('No se encontró el identificador de resultados');
          setLoading(false);
          return;
        }

        console.log('Response ID:', response_id);
        
        // Función para intentar cargar los resultados con reintentos
        const tryLoadResults = async (attempts) => {
          console.log(`Intento ${attempts + 1} de cargar resultados para: ${response_id}`);
          
          try {
            const response = await fetch(`/api/results/${response_id}`);
            
            if (response.status === 404) {
              // Si no se encuentran resultados, y aún podemos reintentar
              if (attempts < 5) {
                console.log(`Resultados no encontrados. Reintentando en 3 segundos...`);
                setLoadingAttempts(attempts + 1);
                // Esperar 3 segundos antes de reintentar
                setTimeout(() => tryLoadResults(attempts + 1), 3000);
                return;
              } else {
                // Si ya hemos intentado demasiadas veces, mostrar error
                setError('No se encontraron resultados después de varios intentos. Por favor, inténtalo de nuevo más tarde.');
                setLoading(false);
                return;
              }
            }
            
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Error fetching results:', errorData);
              setError(errorData.error || 'No se pudieron cargar los resultados');
              setLoading(false);
              return;
            }

            const data = await response.json();
            console.log('Results data from API:', data);
            
            // Formatear los datos de manera más robusta
            const processedResults = {
              totalScore: Number(data.totalScore || data.total_score || 0).toFixed(1),
              masteryLevel: data.masteryLevel || 
                (typeof data.mastery_level === 'string' 
                  ? JSON.parse(data.mastery_level) 
                  : { description: 'No disponible', level: 0 }),
              dimensionScores: Array.isArray(data.dimensionScores) 
                ? data.dimensionScores 
                : (data.dimension_scores 
                  ? JSON.parse(data.dimension_scores) 
                  : [0, 0, 0, 0, 0, 0, 0]),
              recommendations: data.recommendations || 
                (typeof data.recommendations === 'string' 
                  ? JSON.parse(data.recommendations) 
                  : {
                      title: 'Recomendaciones',
                      description: 'No hay recomendaciones disponibles',
                      generalRecommendations: []
                    }),
              userName: data.userName || data.user_name || '',
              userEmail: data.userEmail || data.user_email || ''
            };

            setResults(processedResults);
            setLoading(false);
          } catch (error) {
            console.error('Error in attempt:', error);
            
            // Si aún tenemos intentos disponibles, reintentar
            if (attempts < 5) {
              console.log(`Error en intento ${attempts + 1}. Reintentando en 3 segundos...`);
              setLoadingAttempts(attempts + 1);
              setTimeout(() => tryLoadResults(attempts + 1), 3000);
            } else {
              setError('Ocurrió un error al cargar los resultados después de varios intentos.');
              setLoading(false);
            }
          }
        };

        // Iniciar el proceso de carga con reintentos
        tryLoadResults(0);
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('Ocurrió un error inesperado al cargar los resultados');
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  // Mock data para demostración - en producción esto vendrá de la API
  // Eliminar este bloque cuando se integre con la API real
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !results && !error) {
      // Simular carga de datos después de 1 segundo para demostración
      const timer = setTimeout(() => {
        const mockData = {
          totalScore: 64.5,
          masteryLevel: {
            level: 4,
            description: "Avanzado",
            recommendations: "Tienes un dominio significativo de las capacidades clave de un Influencer Manager. Para alcanzar el nivel experto, enfócate en desarrollar modelos de atribución avanzados y profundizar en la integración estratégica omnicanal."
          },
          dimensionScores: [74, 57, 68, 59, 38, 71, 85],
          userName: "Carlos Rodriguez",
          userEmail: "carlos@example.com",
          recommendations: {
            title: "Plan de Desarrollo Personalizado",
            description: "Basándonos en tu evaluación, hemos creado un plan de desarrollo focalizado en tus áreas de oportunidad y potenciando tus fortalezas.",
            generalRecommendations: [
              "Prioriza el desarrollo de capacidades analíticas avanzadas para mejorar la atribución y ROI",
              "Fortalece la integración omnicanal de tus campañas con influencers",
              "Implementa un framework personalizado para evaluar autenticidad",
              "Aprovecha tu excepcional capacidad de gestión de relaciones para crear programas de embajadores a largo plazo"
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
        <div className="text-2xl font-bold text-blue-900 mb-4 text-center">Cargando tus resultados...</div>
        <div className="text-gray-600 max-w-md text-center mb-2">
          {loadingAttempts > 0 ? 
            `Estamos procesando tu evaluación. Intento ${loadingAttempts} de 6...` : 
            'Estamos analizando tus respuestas para generar recomendaciones personalizadas.'}
        </div>
        <div className="text-sm text-gray-500 max-w-md text-center">
          Este proceso puede tomar unos momentos. Por favor, no cierres esta ventana.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-2xl text-red-600 font-bold mb-4 text-center">{error}</div>
        <p className="text-gray-600 max-w-md text-center mb-8">
          Lo sentimos, no pudimos cargar tus resultados. Esto puede deberse a que los datos aún están siendo procesados o a un problema técnico.
        </p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          onClick={() => window.location.reload()}
        >
          Intentar nuevamente
        </Button>
        <Button 
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg"
          onClick={() => window.location.href = '/'}
        >
          Volver al Inicio
        </Button>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-2xl font-bold text-gray-800 mb-4 text-center">No se encontraron resultados</div>
        <p className="text-gray-600 max-w-md text-center mb-8">
          No pudimos encontrar los resultados para la evaluación solicitada. Es posible que el enlace no sea válido o que los datos hayan sido eliminados.
        </p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          onClick={() => window.location.href = '/assessment'}
        >
          Realizar nueva evaluación
        </Button>
        <Button 
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg"
          onClick={() => window.location.href = '/'}
        >
          Volver al Inicio
        </Button>
      </div>
    );
  }

  const dimensionNames = dimensions.map(d => d.title);

  // Función para determinar el nivel de competencia de cada dimensión
  const getDimensionLevel = (score) => {
    if (score <= 20) return { level: 1, name: "Básico" };
    if (score <= 40) return { level: 2, name: "En desarrollo" };
    if (score <= 60) return { level: 3, name: "Competente" };
    if (score <= 80) return { level: 4, name: "Avanzado" };
    return { level: 5, name: "Experto" };
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Header con score total */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Resultados de tu Evaluación de Capacidades</h1>
              <p className="text-xl text-blue-100">Análisis basado en el marco teórico de 7 dimensiones clave para Influencer Marketing</p>
            </div>
            
            <Card className="bg-white text-blue-900">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-semibold mb-1">Score Total</h2>
                    <div className="text-6xl font-bold text-blue-600">{results.totalScore}%</div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Nivel de Maestría: {results.masteryLevel.description}</h3>
                    <p className="text-gray-600 mb-4">{results.masteryLevel.recommendations}</p>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold text-gray-700">
                          Básico
                        </div>
                        <div className="text-xs font-semibold text-blue-700">
                          Experto
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

      {/* Contenido principal con tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Tabs de navegación */}
            <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
              <button 
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('overview')}
              >
                Resumen
              </button>
              <button 
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${activeTab === 'dimensions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('dimensions')}
              >
                Dimensiones Detalladas
              </button>
              <button 
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('recommendations')}
              >
                Recomendaciones
              </button>
              <button 
                className={`px-4 py-2 font-semibold text-sm whitespace-nowrap ${activeTab === 'resources' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('resources')}
              >
                Recursos
              </button>
            </div>
            
            {/* Contenido de los tabs */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Análisis de Capacidades</h2>
                
                <div className="mb-10">
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <RadarChart 
                        scores={results.dimensionScores}
                        labels={dimensionNames.map(name => name.split(' ').slice(-1)[0])}
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
                  <h3 className="text-xl font-bold mb-4">Tus Fortalezas y Oportunidades</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-bold text-green-600 mb-3">Fortalezas</h4>
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
                            <li className="text-gray-500 italic">Sigue trabajando en desarrollar tus capacidades. ¡Vas por buen camino!</li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-bold text-orange-600 mb-3">Oportunidades de Mejora</h4>
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
                            <li className="text-gray-500 italic">¡Felicidades! Has alcanzado al menos nivel Competente en todas las dimensiones.</li>
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
                <h2 className="text-2xl font-bold mb-6">Análisis Detallado por Dimensión</h2>
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
                  <h3 className="text-xl font-bold mb-4">Niveles de Madurez</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-gray-600 font-semibold mb-1">Nivel 1: Básico (0-20%)</div>
                      <p className="text-sm">Enfoque reactivo, procesos mínimos y uso de métricas superficiales</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-blue-600 font-semibold mb-1">Nivel 2: En desarrollo (21-40%)</div>
                      <p className="text-sm">Procesos básicos establecidos pero sin metodología consistente</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-green-600 font-semibold mb-1">Nivel 3: Competente (41-60%)</div>
                      <p className="text-sm">Sistemas eficientes que equilibran aspectos claves con resultados consistentes</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-yellow-600 font-semibold mb-1">Nivel 4: Avanzado (61-80%)</div>
                      <p className="text-sm">Gestión proactiva con enfoques sofisticados y capacidad predictiva</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="text-purple-600 font-semibold mb-1">Nivel 5: Experto (81-100%)</div>
                      <p className="text-sm">Dominio completo con innovación continua y liderazgo transformacional</p>
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
                  <h3 className="text-xl font-bold mb-4">Recomendaciones Específicas por Dimensión</h3>
                  <div className="space-y-6">
                    {dimensions.map((dimension, idx) => {
                      const score = results.dimensionScores[idx];
                      let specificRecs = [];
                      
                      if (score < 40) {
                        specificRecs = [
                          "Establece un plan de formación fundamental en esta área",
                          "Busca mentores especializados en esta dimensión",
                          "Comienza con proyectos pequeños supervisados para ganar experiencia"
                        ];
                      } else if (score < 70) {
                        specificRecs = [
                          "Profundiza en aspectos específicos de esta dimensión",
                          "Busca proyectos donde puedas desarrollar estas capacidades",
                          "Considera formación especializada para alcanzar nivel avanzado"
                        ];
                      } else {
                        specificRecs = [
                          "Comparte tu conocimiento con otros profesionales",
                          "Busca innovar y desarrollar nuevos enfoques en esta área",
                          "Considera liderar iniciativas o crear contenido formativo"
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
                <h2 className="text-2xl font-bold mb-6">Recursos Recomendados</h2>
                
                <div className="mb-8">
                  <p className="text-lg mb-4">
                    Basado en tus resultados, hemos seleccionado recursos específicos que te ayudarán a desarrollar tus capacidades profesionales como Influencer Manager.
                  </p>
                </div>
                
                {/* Priorizar dimensiones con puntuación baja */}
                {dimensions.map((dimension, idx) => {
                  // Mostrar recursos con énfasis en dimensiones con puntuación menor a 70%
                  const priorityOrder = results.dimensionScores[idx] < 60 ? "alta" :
                                        results.dimensionScores[idx] < 70 ? "media" : "baja";
                  
                  return (
                    <div key={`res-section-${idx}`} className="mb-8">
                      <div className="flex items-center mb-4">
                        <h3 className="text-xl font-bold mr-3">{dimension.title}</h3>
                        {priorityOrder === "alta" && (
                          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Prioridad Alta</span>
                        )}
                        {priorityOrder === "media" && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">Prioridad Media</span>
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
                  <h3 className="text-xl font-bold mb-3 text-blue-800">Plan de Desarrollo Personalizado</h3>
                  <p className="mb-4">
                    Para maximizar tu crecimiento profesional, te recomendamos:
                  </p>
                  <ol className="space-y-2 ml-5 list-decimal">
                    <li className="ml-2">Identifica 2-3 dimensiones prioritarias basadas en tus resultados</li>
                    <li className="ml-2">Selecciona recursos específicos para cada una de estas dimensiones</li>
                    <li className="ml-2">Establece objetivos SMART para tu desarrollo profesional</li>
                    <li className="ml-2">Busca un mentor especializado en marketing de influencers</li>
                    <li className="ml-2">Revisa tu progreso cada 3-6 meses</li>
                  </ol>
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="mt-12 flex flex-wrap gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                onClick={() => window.print()}
              >
                <Download className="w-5 h-5" />
                Descargar Resultados
              </Button>
              <Button 
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                onClick={() => window.location.href = '/'}
              >
                Volver al Inicio
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
        <div className="text-2xl">Cargando...</div>
      </div>
    }>
      <Results />
    </Suspense>
  );
}
