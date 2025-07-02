import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.RIOT_API_KEY;
    
    // 基本情報
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      apiKeyPresent: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiKeyPrefix: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found',
      nodeEnv: process.env.NODE_ENV,
    };

    // APIキーが存在する場合、Riot APIの接続をテスト
    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const testResponse = await fetch('https://jp1.api.riotgames.com/lol/status/v4/platform-data', {
          headers: {
            'X-Riot-Token': apiKey
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        debugInfo.apiTest = {
          status: testResponse.status,
          statusText: testResponse.statusText,
          success: testResponse.ok
        };

        if (testResponse.ok) {
          const data = await testResponse.json();
          debugInfo.serverStatus = data.name;
        } else {
          const errorData = await testResponse.text();
          debugInfo.errorDetails = errorData;
        }
      } catch (apiError) {
        debugInfo.apiError = apiError instanceof Error ? apiError.message : 'API connection failed';
      }
    }

    return NextResponse.json(debugInfo);
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 