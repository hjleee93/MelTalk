import { google } from 'googleapis';
import { type OAuth2Client } from 'googleapis-common';
import { NextFunction, Request, Response } from 'express';
import { encrypt } from '../utils/cryptoHandler';
import userService from '../services/userService';
import { removeAfterAt } from '../utils/stringHelper';
import { registerGmailWatch } from '../utils/gmailHandler';
import { pubSubStart } from '../utils/pubSubHandler';


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
    return res.redirect(authUrl);
  };

  /**
   * 구글 OAuth 콜백 처리
   *  - 기존 사용자는 바로 푸시 알림 등록
   *  - 신규 사용자는 DB에 등록 후 푸시 알림 설정
   */
  public getAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
    
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
      const userEmail = userInfoResponse.data?.email;

      if (!userEmail) {
        return res.status(400).json({ error: '사용자 이메일을 가져올 수 없습니다.' });
      }

      const userName = userInfoResponse.data?.name || removeAfterAt(userEmail);
      const existingUser = await userService.findUserByEmail(userEmail);

      if (existingUser) {
        await Promise.all([
          await registerGmailWatch(oauth2Client),
          await pubSubStart()
        ])
        return res.status(200).json({ message: '성공적으로 인증되었습니다.' });
      }

      //리프레시 토큰 반환 안된경우 -> 다시 인증 시도
      if (!tokens.refresh_token) {
        const authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          prompt: 'consent', //강제인증
          scope: OAUTH_SCOPES
        });
        return res.redirect(authUrl);
      }

      if (!tokens.access_token || !tokens.refresh_token) {
        return res.status(500).json({ error: '토큰 정보가 올바르지 않습니다.' });
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

      
      await Promise.all([
        await registerGmailWatch(oauth2Client),
        await pubSubStart()
      ])
      return res.status(200).json({ message: '성공적으로 인증되었습니다.' });
    } catch (error) {
      next(error);
      //TODO: 에러 클래스 정리
      // return res.status(500).json({ error: 'OAuth 토큰 교환 중 오류 발생' });
    }
  };
}


export default new AuthController();
