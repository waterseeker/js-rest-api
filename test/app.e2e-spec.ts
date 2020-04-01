import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

let app: INestApplication;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  await app.init();
});

afterAll(async () => {
  await app.close();
});

describe('/api/user', () => {
  it('POST with empty body should get 400 response', () => {
    return request(app.getHttpServer())
      .post('/api/user')
      .set('Accept', 'application/json')
      .expect(400);
  });

  test('POST with valid request gets 201', () => {
    return request(app.getHttpServer())
      .post('/api/user')
      .set('Accept', 'application/json')
      .send({
        userId: '43',
        login: 'user1',
        password: 'password1',
      })
      .expect(201);
  });
});

describe('/api/authenticate', () => {
  it('POST with empty body should get 400 response', () => {
    return request(app.getHttpServer())
      .post('/api/authenticate')
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('POST with no user gets 404', () => {
    return request(app.getHttpServer())
      .post('/api/authenticate')
      .set('Accept', 'application/json')
      .send({
        login: 'DOESNOTEXIST',
        password: 'DOESNOTEXIST',
      })
      .expect(404);
  });

  it("POST where password doesn't match gets 401", () => {
    return request(app.getHttpServer())
      .post('/api/authenticate')
      .set('Accept', 'application/json')
      .send({
        login: 'user1',
        password: 'DoesNotMatch',
      })
      .expect(401);
  });

  it('POST with valid request gets 200 with token', done => {
    return request(app.getHttpServer())
      .post('/api/authenticate')
      .set('Accept', 'application/json')
      .send({
        login: 'user1',
        password: 'password1',
      })
      .expect(200)
      .expect(res => {
        if (!('token' in res.body)) throw new Error('missing token key');
        if (
          !res.body.token.match(
            /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/,
          )
        ) {
          throw new Error('invalid token response');
        }
      })
      .end(done);
  });
});

describe('/api/logout', () => {
  it('POST with valid token should get 200 response', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/authenticate')
      .set('Accept', 'application/json')
      .send({
        login: 'user1',
        password: 'password1',
      })
      .expect(200);

    return request(app.getHttpServer())
      .post('/api/logout')
      .set('Accept', 'application/json')
      .set('authentication-header', body.token)
      .expect(200);
  });

  it('POST with invalid token gets 401', () => {
    return request(app.getHttpServer())
      .post('/api/logout')
      .set('Accept', 'application/json')
      .set('authentication-header', 'invalid-12345')
      .expect(401);
  });
});

describe('/api/articles', () => {
  it('POST with empty body gets 401', () => {
    return request(app.getHttpServer())
      .post('/api/articles')
      .set('Accept', 'application/json')
      .set('authentication-header', 'invalid-12345')
      .expect(401);
  });

  it('POST with invalid token gets 401', () => {
    return request(app.getHttpServer())
      .post('/api/articles')
      .set('Accept', 'application/json')
      .set('authentication-header', 'invalid-12345')
      .send({
        articleId: 'string',
        title: 'string',
        content: 'string',
        visibility: 'public',
      })
      .expect(401);
  });

  it('POST with valid request gets 201', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/authenticate')
      .set('Accept', 'application/json')
      .send({
        login: 'user1',
        password: 'password1',
      })
      .expect(200);

    return request(app.getHttpServer())
      .post('/api/articles')
      .set('Accept', 'application/json')
      .set('authentication-header', body.token)
      .send({
        articleId: 'string',
        title: 'string',
        content: 'string',
        visibility: 'private',
      })
      .expect(201);
  });

  it('GET while unauthenticated returns public articles', () => {
    return request(app.getHttpServer())
      .get('/api/articles')
      .set('Accept', 'application/json')
      .expect(200, [
        {
          content: 'here is some content 1',
          visibility: 'public',
          author: '42',
          title: 'testArticle1',
          articleId: 'articleid1',
        },
        {
          content: 'here is some content 6',
          visibility: 'public',
          author: '42',
          title: 'testArticle6',
          articleId: 'articleid6',
        },
      ]);
  });

  it('GET while authenticated returns private articles', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/authenticate')
      .set('Accept', 'application/json')
      .send({
        login: 'user1',
        password: 'password1',
      })
      .expect(200);

    return request(app.getHttpServer())
      .get('/api/articles')
      .set('Accept', 'application/json')
      .set('authentication-header', body.token)
      .expect(200, [
        {
          content: 'here is some content 1',
          visibility: 'public',
          author: '42',
          title: 'testArticle1',
          articleId: 'articleid1',
        },
        {
          content: 'here is some content 3',
          visibility: 'logged_in',
          author: '42',
          title: 'testArticle3',
          articleId: 'articleid3',
        },
        {
          content: 'here is some content 4',
          visibility: 'private',
          author: '43',
          title: 'testArticle4',
          articleId: 'articleid4',
        },
        {
          content: 'here is some content 5',
          visibility: 'logged_in',
          author: '42',
          title: 'testArticle5',
          articleId: 'articleid5',
        },
        {
          content: 'here is some content 6',
          visibility: 'public',
          author: '42',
          title: 'testArticle6',
          articleId: 'articleid6',
        },
        {
          content: 'string',
          visibility: 'private',
          author: '43',
          title: 'string',
          articleId: 'string',
        },
      ]);
  });
});
