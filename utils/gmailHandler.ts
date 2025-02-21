// history 추적 예시
import { google } from 'googleapis';
import { type OAuth2Client } from 'googleapis-common';

export async function listHistory(authClient: OAuth2Client, startHistoryId : string) {
  const gmail = google.gmail({ version: 'v1', auth: authClient  });

  try {
    const res = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: startHistoryId,
    });
    
    // history 이벤트 배열
    const history = res.data.history;
    if (history && history.length > 0) {
      history.forEach(event => {
        console.log('History 이벤트:', event);
      });
    } else {
      console.log('새로운 history 이벤트가 없습니다.');
    }
  } catch (error) {
    console.error('history.list() 호출 에러:', error);
  }
}



export async function registerGmailWatch (authClient: OAuth2Client) {
  try{
    const gmail = google.gmail({version: 'v1', auth: authClient});
  
    const watch = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        labelIds: ["INBOX"],
        topicName: `projects/${process.env.PROJECT_ID}/topics/${process.env.TOPIC_NAME}`
      },
      
    });
    const { expiration, historyId } = watch.data;
    console.log('Gmail Watch 등록 성공:', { expiration, historyId });
  }catch(err){
    throw('Gmail watch 등록 실패')
  }
 
}