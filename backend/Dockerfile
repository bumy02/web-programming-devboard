# Node.js 18 버전을 베이스 이미지로 사용
FROM node:18-alpine

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 백엔드 소스코드 전체 복사
COPY . .

# 5000번 포트 개방
EXPOSE 5000

# 서버 실행 명령어
CMD ["node", "server.js"]