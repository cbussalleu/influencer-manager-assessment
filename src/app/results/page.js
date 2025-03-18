'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';
import { ArrowRight, BookOpen, Download, ExternalLink, BarChart, Users, Brain, Code, Heart, Target } from 'lucide-react';

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
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-green-100 text-green-800';
      case 5: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getLevelName = () => {
    switch(level) {
      case 1: return 'Principiante';
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
      title: "Capacidades Organizacionales",
      description: "Alineación estratégica, comprensión organizacional, integración departamental y gestión de recursos."
    },
    {
      icon: Users,
      title: "Capacidades Interpersonales",
      description: "Comunicación interdisciplinaria, facilitación, manejo de conflictos y construcción de relaciones."
    },
    {
      icon: Brain,
      title: "Capacidades Cognitivas",
      description: "Comprensión de sistemas complejos, pensamiento abstracto, innovación y adaptabilidad."
    },
    {
      icon: Code,
      title: "Capacidades Técnicas",
      description: "Metodologías UCD, prototipado, herramientas digitales y documentación."
    },
    {
      icon: Heart,
      title: "Capacidades Emocionales",
      description: "Empatía, resiliencia, manejo del estrés y gestión emocional."
    },
    {
      icon: Target,
      title: "Capacidades de Liderazgo",
      description: "Inspiración, decisiones estratégicas, desarrollo de talento y promoción de innovación."
    }
  ];

  // Recursos recomendados por dimensión
  const recommendedResources = {
    0: [ // Organizacionales
      {
        title: "Business Strategy and Design",
        type: "curso",
        link: "https://www.coursera.org/learn/business-strategy-design",
        description: "Aprende a alinear iniciativas de diseño con objetivos estratégicos de negocio."
      },
      {
        title: "The Design of Business",
        type: "libro",
        link: "https://www.amazon.com/Design-Business-Competitive-Advantage-Innovation/dp/1422177807",
        description: "Roger Martin explora cómo el pensamiento de diseño transforma las organizaciones."
      }
    ],
    1: [ // Interpersonales
      {
        title: "Advanced Facilitation Techniques",
        type: "curso",
        link: "https://www.mural.co/academy",
        description: "Mejora tus habilidades de facilitación para workshops y sesiones colaborativas."
      },
      {
        title: "Articulating Design Decisions",
        type: "libro",
        link: "https://www.amazon.com/Articulating-Design-Decisions-Communicate-Stakeholders/dp/1491921560",
        description: "Aprende a comunicar efectivamente decisiones de diseño a stakeholders."
      }
    ],
    2: [ // Cognitivas
      {
        title: "Systems Thinking in Practice",
        type: "curso",
        link: "https://www.edx.org/course/systems-thinking-in-practice",
        description: "Desarrolla tu capacidad para comprender y modelar sistemas complejos."
      },
      {
        title: "Thinking in Systems: A Primer",
        type: "libro",
        link: "https://www.amazon.com/Thinking-Systems-Donella-H-Meadows/dp/1603580557",
        description: "El libro clásico de Donella Meadows sobre pensamiento sistémico."
      }
    ],
    3: [ // Técnicas
      {
        title: "User Experience Research & Design",
        type: "curso",
        link: "https://www.coursera.org/specializations/michiganux",
        description: "Especialización completa de la Universidad de Michigan sobre UX Research y Design."
      },
      {
        title: "Universal Methods of Design",
        type: "libro",
        link: "https://www.amazon.com/Universal-Methods-Design-Innovative-Effective/dp/1592537561",
        description: "Compendio de métodos para investigación, análisis y conceptualización en diseño."
      }
    ],
    4: [ // Emocionales
      {
        title: "Emotional Intelligence in Leadership",
        type: "curso",
        link: "https://www.linkedin.com/learning/emotional-intelligence-in-leadership",
        description: "Aprende a desarrollar y aplicar inteligencia emocional en contextos profesionales."
      },
      {
        title: "Permission to Feel",
        type: "libro",
        link: "https://www.amazon.com/Permission-Feel-Unlocking-Emotions-Ourselves/dp/1250212847",
        description: "Marc Brackett explora cómo entender y gestionar nuestras emociones."
      }
    ],
    5: [ // Liderazgo
      {
        title: "Design Leadership",
        type: "curso",
        link: "https://www.cooperhewitt.org/design-leadership",
        description: "Programa enfocado en desarrollar capacidades de liderazgo en diseño."
      },
      {
        title: "Radical Candor",
        type: "libro",
        link: "https://www.amazon.com/Radical-Candor-Revised-Kick-Ass-Humanity/dp/1250235375",
        description: "Kim Scott presenta un enfoque efectivo para el feedback y desarrollo de equipos."
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
                  : [0, 0, 0, 0, 0, 0]),
              recommendations: data.recommendations || 
                (typeof data.recommendations === 'string' 
                  ? JSON.parse(data.recommendations) 
                  : {
                      title: 'Recomendaciones',
                      description: 'No hay recomendaciones disponibles',
                      generalRecommendations: []
                    })
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

  return (
    <div className="min-h-screen font-westmount bg-gray-50">
      {/* Header con score total */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Resultados de tu Evaluación de Capacidades</h1>
              <p className="text-xl text-blue-100">Análisis basado en el marco teórico de capacidades y condiciones en diseño de servicios</p>
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
                        <div className="text-xs font-semibold text-green-700">
                          Principiante
                        </div>
                        <div className="text-xs font-semibold text-blue-700">
                          Experto
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                        <div style={{ width: `${results.totalScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-blue-600"></div>
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
                        labels={dimensionNames}
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
                                  <span><strong>{dimensionNames[idx]}</strong>: {score.toFixed(1)}%</span>
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
                            if (score < 70) {
                              return (
                                <li key={`opportunity-${idx}`} className="flex items-start gap-2">
                                  <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                                  <span><strong>{dimensionNames[idx]}</strong>: {score.toFixed(1)}%</span>
                                </li>
                              );
                            }
                            return null;
                          })}
                          {results.dimensionScores.filter(score => score < 70).length === 0 && (
                            <li className="text-gray-500 italic">¡Felicidades! Has alcanzado un nivel avanzado en todas las dimensiones.</li>
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
              </div>
            )}
            
            {activeTab === 'recommendations' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{results.recommendations.title}</h2>
                <Card className="mb-8 bg-yellow-50 border-yellow-200">
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
                        specificRecs = ["Establece un plan de formación fundamental", "Busca mentores en esta área", "Comienza con proyectos pequeños supervisados"];
                      } else if (score < 70) {
                        specificRecs = ["Profundiza en aspectos específicos", "Busca proyectos donde puedas desarrollar estas capacidades", "Considera formación especializada"];
                      } else {
                        specificRecs = ["Comparte tu conocimiento con otros", "Busca innovar en esta área", "Considera liderar iniciativas"];
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
                    Basado en tus resultados, hemos seleccionado recursos específicos que te ayudarán a desarrollar tus capacidades profesionales en diseño de servicios.
                  </p>
                </div>
                
                {dimensions.map((dimension, idx) => {
                  // Mostrar recursos solo para dimensiones con puntuación menor a 70%
                  if (results.dimensionScores[idx] >= 70) return null;
                  
                  return (
                    <div key={`res-section-${idx}`} className="mb-8">
                      <h3 className="text-xl font-bold mb-4">{dimension.title}</h3>
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
                
                {/* Si todas las dimensiones tienen puntuación mayor a 70% */}
                {dimensions.every((_, idx) => results.dimensionScores[idx] >= 70) && (
                  <div className="text-center p-8 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-bold mb-4 text-blue-800">¡Felicidades por tu alto nivel!</h3>
                    <p className="text-gray-700 mb-4">
                      Has alcanzado un excelente nivel en todas las dimensiones evaluadas. Te recomendamos enfocarte en:
                    </p>
                    <ul className="text-left inline-block mx-auto mb-6">
                      <li className="flex items-start gap-2 mb-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                        <span>Compartir tu conocimiento y mentorizar a otros profesionales</span>
                      </li>
                      <li className="flex items-start gap-2 mb-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                        <span>Liderar iniciativas de innovación en tu organización</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                        <span>Explorar nuevos enfoques y metodologías emergentes</span>
                      </li>
                    </ul>
                  </div>
                )}
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
