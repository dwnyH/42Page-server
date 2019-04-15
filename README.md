# **42Page - Client & Server**

42Page는 책에서 마음에 드는 구절을 편리하고 가독성있게 저장할 수 있는 모바일 웹 어플리케이션입니다. 책의 문장을 사진으로 찍으면 텍스트화 보여주도록 하고, 다른 사람들과 어플리케이션 내에서 메모 내용을 공유할 수 있습니다.

## **Preview**

![preview](https://github.com/hiiiii11/42Page-client/blob/master/src/42page-gif.gif)

### **Features**

* 로그인, 회원 인증
* 카메라 또는 사진앨범에서 사진 선택 후, 그리드로 영역 설정
* 사진 파일에서 지정된 영역 텍스트로 변환
* 텍스트로 변환한 메모에 책 정보, 메모 입력
* 메모 CRUD 기능
* 사용자 전체 메모 피드 최신순으로 보기 제공
* 사용자 프로필별 모든 메모, 책 메모 보기 제공
* 사용자의 상위 50개 키워드, wordcloud 형태로 보기 제공
* 관심있는 키워드를 가지고 있는 사용자 검색

### **Installation**

**Client**

```javascript
git clone https://github.com/hiiiii11/42Page-client.git
cd 42Page-client
npm install
npm start
```

**Server**

```javascript
git clone https://github.com/hiiiii11/42Page-server.git
cd 42Page-server
npm install
npm start
```

------



## **Skills**

**1. Client Side**

* ES2015 +
* React, Create-React-App
* Redux
* React Router
* HTTP request using Axios
* Firebase Authentication
* API : Google Vision API / Kakao Books API / ETRI AI 형태소 분석 API
* Jest and Enzyme for Unit-test

**2. Server side**

* Express
* Node.js
* JSON Web Token Authentication
* Mongoose
* Mongo DB, Atlas

------



## **Version Control**

* Git, Github
* Trello를 이용한 일정관리

------

## **Deployment**

* **Client** : Netlify 서비스 이용하여 client 배포
* **Server**: AWS Elastic Beanstalk


------

## **Things to do**

* ~~AWS로 배포한 서버 https 연결~~
* Circle CI
* Component Unit Test
* Server Api Unit Test
* Integration Test
* 메모별 좋아요, 댓글 기능



## **Sincere Thanks**

[Ken Huh](https://github.com/ken123777 "ken huh") / Vanilla Coding 
