import '../test-util';
import * as supertest from 'supertest';
import app from '@food-js/server/app';

describe('App', () => {
  it('works', () =>
    supertest(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
  )
});
