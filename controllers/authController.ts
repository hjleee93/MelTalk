import { google } from 'googleapis';
import { Request, Response } from 'express';



export const getOAuthPermission = async (req: Request, res: Response) => {

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID!,
  process.env.CLIENT_SECRET!,
  process.env.REDIRECT_URI!
);

// 인증 URL 생성 (사용자에게 권한 동의를 받기 위해)
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // refresh token을 받기 위함
  scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'], // 필요한 스코프 설정
});
  // authUrl()
  console.log('다음 URL에서 인증하세요:', authUrl);

  res.send(authUrl);
  // }
};

export const getAuthCallback = async (req: Request, res: Response) => {

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID!,
    process.env.CLIENT_SECRET!,
    process.env.REDIRECT_URI!
  );

  const code = req.query.code as string;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // 토큰을 세션이나 DB에 저장하는 로직을 추가할 수 있습니다.
    res.json(tokens);
  } catch (error) {
    console.error('OAuth 토큰 교환 오류:', error);
    res.status(500).json({ error: 'OAuth 토큰 교환 중 오류 발생' });
  }
}
