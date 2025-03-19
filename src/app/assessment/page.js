'use client';
import React from 'react';
import { Widget } from '@typeform/embed-react';

export default function AssessmentForm() {
  return (
    <div className="min-h-screen">
      <div className="h-screen">
        <Widget 
          id="TBBqrH5Q"
          style={{ width: '100%', height: '100%' }} 
          className="my-form"
          onSubmit={(event) => {
            console.log('Typeform submission event:', event);
            
            // Usar token o response_id, con múltiples fallbacks
            const response_id = 
              event.response_id || 
              event.token || 
              event.responseId;

            if (response_id) {
              console.log('Redirecting with response ID:', response_id);
              
              // Añadir un pequeño retraso para dar tiempo a que se procese el webhook
              // Esto es especialmente útil en dispositivos móviles
              document.body.innerHTML = `
                <div style="
                  display: flex; 
                  flex-direction: column; 
                  justify-content: center; 
                  align-items: center; 
                  height: 100vh; 
                  text-align: center;
                  font-family: sans-serif;
                  padding: 20px;
                ">
                  <h2 style="margin-bottom: 20px; color: #1e40af;">Procesando tus respuestas...</h2>
                  <p style="margin-bottom: 30px; color: #6b7280;">Estamos analizando tus resultados. Serás redirigido automáticamente en unos segundos.</p>
                  <div style="
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(30, 64, 175, 0.2);
                    border-top: 5px solid #1e40af;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                  "></div>
                </div>
                <style>
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                </style>
              `;
              
              setTimeout(() => {
                window.location.href = `/results?response_id=${response_id}`;
              }, 3000); // 3 segundos de retraso
            } else {
              console.warn('No response ID found in submission event');
              window.location.href = '/results';
            }
          }}
        />
      </div>
    </div>
  );
}
