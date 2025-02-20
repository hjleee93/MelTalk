import { google } from 'googleapis';
import { Request, Response } from 'express';
import open from 'open';
import { encrypt } from '../utils/cryptoHandler';
import userService from '../services/userService';
import { removeAfterAt } from '../utils/stringHelper';

// OAuth에 필요한 scope 상수
const OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify'
];
class AuthController {
  private createOAuthClient() {
    return new google.auth.OAuth2(
      process.env.CLIENT_ID!,
      process.env.CLIENT_SECRET!,
      process.env.REDIRECT_URI!
    );
  }

  public getOAuthPermission = async (req: Request, res: Response) => {
    const oauth2Client = this.createOAuthClient();

    // 인증 URL 생성 (필요한 스코프 설정)
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // refresh token을 받기 위함
      scope: OAUTH_SCOPES
    });

    // 인증 URL을 브라우저에서 열기
    await open(authUrl);
    return res.status(200).json({ message: '인증 URL을 열었습니다.' });
  };

  // 구글 OAuth 콜백 처리
  public getAuthCallback = async (req: Request, res: Response) => {
    const oauth2Client = this.createOAuthClient();
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ error: '인증 코드가 제공되지 않았습니다.' });
    }

    try {
      // 인증 코드를 토큰으로 교환
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // 사용자 정보 가져오기
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
      });
      const userInfoResponse = await oauth2.userinfo.get();
      const userEmail = userInfoResponse.data.email;
      if (!userEmail) {
        return res.status(400).json({ error: '사용자 이메일을 가져올 수 없습니다.' });
      }
      const userName = userInfoResponse.data.name || removeAfterAt(userEmail);

      const existingUser = await userService.findUserByEmail(userEmail);

      if (!existingUser) {

        // refresh token 검증 
        if (!tokens.refresh_token) {
          //없으면 강제 인증
          const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: OAUTH_SCOPES
          });
          return await open(authUrl);
        }
        const encryptedToken = encrypt(tokens.access_token!);
        const encryptedRefreshToken = encrypt(tokens.refresh_token);
        await userService.createUser({
          name: userName,
          email: userEmail,
          encrypted_token: encryptedToken,
          encrypted_refresh_token: encryptedRefreshToken,
          token_expires_at: tokens.expiry_date,
        });
      } else {

      }

      return res.status(200).json({ message: '성공적으로 인증되었습니다.' });
    } catch (error) {
      console.error('OAuth 토큰 교환 오류:', error);
      return res.status(500).json({ error: 'OAuth 토큰 교환 중 오류 발생' });
    }
  };
}

export default new AuthController();
