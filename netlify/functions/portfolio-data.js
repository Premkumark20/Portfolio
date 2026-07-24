const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'text/csv',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Path to the CSV file in the built site
    const csvPath = path.join(process.cwd(), 'public', 'data', 'portfolio.csv');
    
    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Portfolio data not found' })
      };
    }

    // Read and return CSV data
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    return {
      statusCode: 200,
      headers,
      body: csvData
    };
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
