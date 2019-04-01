# **42Page - client & sever**

42Page는 책에서 마음에 드는 구절을 편리하고 가독성있게 저장할 수 있는 모바일 웹 어플리케이션입니다. 책의 문장을 사진으로 찍으면 text화시켜서 보여주도록 하고, 다른 사람들과 어플리케이션 내에서 메모 내용을 공유할 수 있습니다.

Table of Contents

- Features
- Installation
- Skills
- Version Control and Collaboration
- Deployment
- Challenges
- Things to do

### **Features**

- 로그인, 회원 인증
- 카메라 또는 사진앨범에서 사진 선택 후, grid로 영역 설정
- 사진 파일에서 지정된 영역 텍스트로 변환
- 텍스트로 변환한 메모에 책 정보, 메모 덧붙이기
- 메모 CRUD 기능
- 사용자 전체 메모 피드 최신순으로 보기
- 사용자 profile별 모든 메모, 책 메모 보기
- 사용자의 상위 50개 keyword, wordcloud 형태로 보기
- 관심있는 keyword를 가지고 있는 사용자 검색

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

- ES2015 +
- React, Create-React-app
- Redux
- React Router
- HTTP request using Axios
- Firebase Authentication
- api : Google vision api / Kakao books api / ETRI AI 형태소 분석 API

**2. Server side**

- Express
- Node.js
- JSON Web Token Authentication
- mongoose
- Mongo DB, atlas

------



## **Version Control**

- Git, Github
- Trello를 이용한 일정관리

------

## Deployment

- **Client** : Netlify 서비스 이용하여 client 배포
- **Server**: AWS Elastic Beanstalk

------

## **Challenges**

- **iphone 에서의 사진 오류 문제**

  -> desktop web 환경에서 구현하는 것만 익숙하다보니 핸드폰으로 테스트 해보았을 때 오류가 생긴 원인과  해결방법을 찾는데에 쉽지 않았습니다. 다행히 stackoverflow를 통해 metadata에 의한 image rotating현상을 알게 되었고, 이러한 환경을 벗어날 수 있도록 도와주는 library를 이용하여 문제를 해결하였습니다. 

- **user schema 문제**

  -> 처음에 mongoose query에 익숙하지 않고 create와 read 기능만을 고려하여 schema를 작성하다보니, 사용자별로 저장된 책을 쉽게 불러올 수 있게끔 사용자 model schema에 책들을 title만 배열 형식으로 저장하는 형태로 설계하였습니다. 이런 식으로 진행하다보니 나중에 update, delete기능이 실행될 때 사용자 schema의 책 배열에 접근하여 확인해봐야하는 번거로움이 생겨 이를 삭제하고, 메모 schema에 user id를 삽입하여 메모 update/delete는 메모 schema에만 접근하도록 처리하고, create/read는 memo schema에서 user id와  book.title의 쿼리를 동시에 잡아서 처리하는 방식으로 해결하였습니다.



------

## **Things to do**

- 메모별 좋아요, 댓글 기능
- circle ci
- component unit test
- server api unit test
- integration test
- code refactoring





Special Thanks to [Ken Huh](https://github.com/ken123777 "ken huh") / Vanilla Coding 
