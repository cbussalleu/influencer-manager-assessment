import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Lista para almacenar resultados
    const checks = [];
    
    // Comprobar paquetes instalados
    try {
      const packageJson = require('../../../package.json');
      checks.push({
        name: 'package.json dependencies',
        found: true,
        dependencies: packageJson.dependencies,
        hasSendgrid: !!packageJson.dependencies['@sendgrid/mail'],
        hasNodemailer: !!packageJson.dependencies['nodemailer'],
      });
    } catch (error) {
      checks.push({
        name: 'package.json',
        found: false,
        error: error.message
      });
    }
    
    // Intentar importar nodemailer (si está instalado)
    try {
      const nodemailer = require('nodemailer');
      checks.push({
        name: 'nodemailer',
        found: true,
        version: nodemailer.version,
      });
    } catch (error) {
      checks.push({
        name: 'nodemailer',
        found: false,
        error: error.message
      });
    }
    
    // Intentar importar @sendgrid/mail
    try {
      const sgMail = require('@sendgrid/mail');
      checks.push({
        name: '@sendgrid/mail',
        found: true,
        // Verificar si sgMail usa nodemailer internamente
        usesNodemailer: !!sgMail.Mail?.prototype?.nodemailer || false
      });
    } catch (error) {
      checks.push({
        name: '@sendgrid/mail',
        found: false,
        error: error.message
      });
    }
    
    // Verificar variables de entorno (sin mostrar valores completos por seguridad)
    checks.push({
      name: 'environment variables',
      hasSendgridApiKey: !!process.env.SENDGRID_API_KEY,
      hasSendgridSenderEmail: !!process.env.SENDGRID_SENDER_EMAIL,
      hasInterviewerEmail: !!process.env.INTERVIEWER_EMAIL,
    });
    
    return NextResponse.json({ 
      checks,
      serverInfo: {
        environment: process.env.NODE_ENV,
        runtimeVersion: process.version,
        platform: process.platform
      }
    });
  } catch (error) {
    console.error('Error checking dependencies:', error);
    return NextResponse.json({ 
      error: 'Error checking dependencies',
      details: error.message
    }, { status: 500 });
  }
}
