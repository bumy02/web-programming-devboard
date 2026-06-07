# 1단계: React 빌드 (Node.js 환경)
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: Nginx를 이용해 정적 파일 서빙 및 프록시 설정
FROM nginx:alpine
# 빌드된 결과물을 Nginx 폴더로 복사
COPY --from=build /app/dist /usr/share/nginx/html
# 기본 Nginx 설정을 지우고 우리가 만든 설정 파일로 교체
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]