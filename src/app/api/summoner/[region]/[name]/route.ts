import { NextRequest, NextResponse } from 'next/server';
import { riotAPI } from '@/lib/riot-api';
import { getMockSummoner, normalizeSummonerName } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { region: string; name: string } }
) {
  try {
    const { region, name } = params;

    // パラメータの詳細ログ
    console.log('Summoner API Request:', {
      region,
      name: decodeURIComponent(name),
      originalName: name,
      timestamp: new Date().toISOString()
    });

    if (!region || !name) {
      return NextResponse.json(
        { 
          error: 'Region and summoner name are required',
          received: { region, name }
        },
        { status: 400 }
      );
    }

    // デコードされた名前を使用
    const decodedName = decodeURIComponent(name);
    const normalizedRegion = region.toLowerCase();
    
    // まずRiot APIを試行
    try {
      console.log('Attempting to fetch summoner from Riot API:', {
        region: normalizedRegion,
        name: decodedName
      });

      const summonerData = await riotAPI.getSummonerByName(normalizedRegion, decodedName);
      
      console.log('Summoner data retrieved successfully from Riot API:', {
        summonerId: summonerData.id,
        summonerName: summonerData.name,
        level: summonerData.summonerLevel
      });
      
      return NextResponse.json(summonerData);
    } catch (riotError) {
      console.log('Riot API failed, attempting mock data fallback:', {
        error: riotError instanceof Error ? riotError.message : 'Unknown error',
        searchName: decodedName
      });

      // Riot APIが失敗した場合、モックデータにフォールバック
      const mockSummoner = getMockSummoner(decodedName);
      
      if (mockSummoner) {
        console.log('Mock summoner data found:', {
          name: mockSummoner.name,
          level: mockSummoner.summonerLevel
        });

        // モックデータからの取得であることを示すフラグを追加
        return NextResponse.json({
          ...mockSummoner,
          _isMockData: true,
          _mockMessage: 'このデータはデモ用のモックデータです。実際のRiot APIが利用できない場合に表示されています。'
        });
      }

      // モックデータも見つからない場合は、元のエラーを詳細に返す
      throw riotError;
    }
  } catch (error) {
    // 詳細なエラーログ
    console.error('Error in summoner API:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      params,
      timestamp: new Date().toISOString()
    });

    // エラーレスポンスにより詳細な情報を含める
    if (error instanceof Error) {
      // Riot API特有のエラーハンドリング
      if (error.message.includes('404')) {
        return NextResponse.json(
          { 
            error: 'Summoner not found',
            details: `サモナー "${decodeURIComponent(params.name)}" が ${params.region} リージョンで見つかりませんでした。`,
            suggestions: [
              'サモナー名のスペルを確認してください',
              '正しいリージョンを選択してください',
              'サモナー名に特殊文字が含まれていないか確認してください',
              'デモ用に以下のサモナー名をお試しください: "Hide on bush", "Faker", "Caps", "Showmaker"'
            ]
          },
          { status: 404 }
        );
      } else if (error.message.includes('403')) {
        return NextResponse.json(
          { 
            error: 'API access forbidden',
            details: 'Riot API キーの問題または権限不足です。デモ用のモックデータを使用してアプリケーションをお試しください。',
            suggestions: [
              'デモ用サモナー名をお試しください: "Hide on bush", "Faker", "Caps", "Showmaker"',
              'API キーが有効期限内であることを確認してください',
              'API キーが正しく設定されていることを確認してください'
            ]
          },
          { status: 403 }
        );
      } else if (error.message.includes('429')) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            details: 'API の呼び出し制限に達しました。しばらく待ってから再試行してください。',
            suggestions: [
              '少し時間をおいてから再試行してください',
              'デモ用サモナー名をお試しください: "Hide on bush", "Faker", "Caps", "Showmaker"'
            ]
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch summoner data',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        region: params.region,
        summonerName: decodeURIComponent(params.name),
        suggestions: [
          'デモ用サモナー名をお試しください: "Hide on bush", "Faker", "Caps", "Showmaker"',
          'しばらく待ってから再試行してください'
        ]
      },
      { status: 500 }
    );
  }
} 