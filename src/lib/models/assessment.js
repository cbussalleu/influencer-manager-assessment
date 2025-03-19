import { sql } from '@vercel/postgres';

export async function createAssessmentResult(results) {
  try {
    // Debug log to see credentials being used
    console.log('Database connection info:', {
      host: process.env.POSTGRES_HOST || 'not set',
      user: process.env.POSTGRES_USER || 'not set',
      database: process.env.POSTGRES_DATABASE || 'not set',
      passwordSet: process.env.POSTGRES_PASSWORD ? 'yes' : 'no'
    });
    
    const {
      response_id,
      responseId,
      totalScore,
      total_score,
      masteryLevel,
      mastery_level,
      dimensionScores,
      dimension_scores,
      recommendations,
      userName,
      userEmail
    } = results;
    
    // Use any version of the ID that is available
    const finalResponseId = response_id || responseId;
    const finalTotalScore = totalScore || total_score || 0;
    const finalMasteryLevel = masteryLevel || mastery_level || { level: 1, description: "Basic" };
    const finalDimensionScores = dimensionScores || dimension_scores || [0,0,0,0,0,0,0];
    
    if (!finalResponseId) {
      throw new Error('Response ID is required');
    }
    
    console.log('Saving to database:', {
      finalResponseId,
      finalTotalScore,
      finalMasteryLevel: JSON.stringify(finalMasteryLevel),
      finalDimensionScores: JSON.stringify(finalDimensionScores),
      recommendations: JSON.stringify(recommendations || {}),
      userName: userName || '',
      userEmail: userEmail || ''
    });
    
    // New SQL query that includes userName and userEmail
    const query = `
      INSERT INTO assessment_results 
      (response_id, total_score, mastery_level, dimension_scores, recommendations, user_name, user_email, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (response_id) DO UPDATE 
      SET 
        total_score = EXCLUDED.total_score,
        mastery_level = EXCLUDED.mastery_level,
        dimension_scores = EXCLUDED.dimension_scores,
        recommendations = EXCLUDED.recommendations,
        user_name = EXCLUDED.user_name,
        user_email = EXCLUDED.user_email,
        created_at = NOW()
      RETURNING *
    `;
    
    const values = [
      finalResponseId,
      finalTotalScore,
      JSON.stringify(finalMasteryLevel),
      JSON.stringify(finalDimensionScores),
      JSON.stringify(recommendations || {}),
      userName || '',
      userEmail || ''
    ];
    
    const result = await sql.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Detailed error creating assessment result:', {
      message: error.message,
      stack: error.stack,
      results: results
    });
    throw error;
  }
}

export async function getAssessmentResultByResponseId(responseId) {
  try {
    if (!responseId) {
      throw new Error('Response ID is required');
    }
    console.log('Looking for results with responseId:', responseId);
    
    // Updated to include user_name and user_email
    const query = `
      SELECT 
        response_id, 
        total_score, 
        mastery_level, 
        dimension_scores, 
        recommendations,
        user_name,
        user_email,
        created_at
      FROM assessment_results
      WHERE response_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await sql.query(query, [responseId]);
    
    // Function to safely parse JSON
    const safeParseJSON = (input, defaultValue = null) => {
      // If it's already an object, return it directly
      if (typeof input === 'object' && input !== null) {
        return input;
      }

      try {
        return input ? JSON.parse(input) : defaultValue;
      } catch (error) {
        console.error('JSON parsing error:', {
          input,
          error: error.message
        });
        return defaultValue;
      }
    };

    if (!result.rows.length) {
      return null;
    }

    const row = result.rows[0];
    
    console.log('Database query result:', {
      found: true,
      responseId: row.response_id,
      userName: row.user_name
    });
    
    return {
      responseId: row.response_id,
      totalScore: row.total_score,
      masteryLevel: safeParseJSON(row.mastery_level, { level: 1, description: "Not determined" }),
      dimensionScores: safeParseJSON(row.dimension_scores, [0,0,0,0,0,0,0]),
      recommendations: safeParseJSON(row.recommendations, {}),
      userName: row.user_name || '',
      userEmail: row.user_email || '',
      createdAt: row.created_at
    };
  } catch (error) {
    console.error('Detailed error fetching assessment result:', {
      message: error.message,
      stack: error.stack,
      responseId: responseId
    });
    throw error;
  }
}
