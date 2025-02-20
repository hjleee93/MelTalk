## 개발 환경

- 언어: TypeScript (tsx 파일 형식으로 개발)
- 환경 변수: `.env.local`, `.env.development`, `.env.production` 파일을 사용하여 설정 
- package.json에 실행 방식 구분 

```
URL=서버주소
SERVER_PORT=서버 포트
DATABASE=디비 이름
USERNAME=디비 유저 이름
PASSWORD=디비 유저 패스워드
HOST=디비 호스트
PORT=디비 포트
ENCRYPTION_KEY=토큰 암호화에 필요한 키
```

## 기술 스택

- Node.js: v23.7.0
- TypeScript
- Express
- mariaDB, sequelize


## 명명 규칙
- handler : 특정 요청을 받아서 사용되는 함수인 경우 
- helper : 재사용 가능한 함수
