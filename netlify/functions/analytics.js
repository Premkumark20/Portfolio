exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { page, referrer, userAgent } = event.httpMethod === 'POST' 
      ? JSON.parse(event.body || '{}')
      : event.queryStringParameters || {};

    // Extract visitor information
    const visitorInfo = {
      timestamp: new Date().toISOString(),
      page: page || event.path || '/',
      referrer: referrer || event.headers.referer || 'direct',
      userAgent: userAgent || event.headers['user-agent'] || 'unknown',
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
      country: event.headers['x-country'] || 'unknown',
      method: event.httpMethod
    };

    // Log analytics data (in production, save to database or analytics service)
    console.log('Analytics event:', visitorInfo);

    if (event.httpMethod === 'POST') {
      // Track page view
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Page view tracked',
          timestamp: visitorInfo.timestamp
        })
      };
    } else {
      // Return basic stats (mock data - in production, fetch from database)
      const mockStats = {
        totalViews: 1247,
        uniqueVisitors: 892,
        topPages: [
          { page: '/', views: 456 },
          { page: '/projects', views: 234 },
          { page: '/about', views: 189 }
        ],
        topReferrers: [
          { referrer: 'direct', count: 567 },
          { referrer: 'google.com', count: 234 },
          { referrer: 'github.com', count: 123 }
        ],
        lastUpdated: new Date().toISOString()
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockStats)
      };
    }

  } catch (error) {
    console.error('Analytics error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process analytics request'
      })
    };
  }
};
