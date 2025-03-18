import { NextResponse } from 'next/server';
import { getAssessmentResultByResponseId } from '@/lib/models/assessment';

export async function GET(request, { params }) {
  const { responseId } = params;
  
  console.log("Fetching results for responseId:", responseId);
  
  try {
    const result = await getAssessmentResultByResponseId(responseId);
    
    if (!result) {
      console.log("No results found for responseId:", responseId);
      return NextResponse.json({ 
        error: 'Results not found' 
      }, { status: 404 });
    }
    
    console.log("Results found:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ 
      error: 'Error fetching results',
      details: error.message
    }, { status: 500 });
  }
}
