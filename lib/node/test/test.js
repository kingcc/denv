const assert = require('assert'),
  request = require('supertest');

describe('node-demo', function() {
  describe('restful-api', function() {
    before(function() {
      //TODO
    });

    after(function() {
      //TODO
    });

    beforeEach(function() {
      //TODO
    });

    afterEach(function() {
      //TODO
    });

    //TODO
    it('start with fun 1 plus 1 equal 2', function() {
      assert.equal(1 + 1, 2);
    });
    it('#async function', async() => {
      let r = 15; //await hello();
      assert.strictEqual(r, 15);
    });
    // it('test async function', function(done) {
    //   fs.readFile('filepath', done);
    // });

  });
  // describe('#test koa app', () => {

  //   let server = app.listen(9900);

  //   describe('#test server', () => {

  //     it('#test GET /', async() => {
  //       let res = await request(server)
  //         .get('/')
  //         .expect('Content-Type', /text\/html/)
  //         .expect(200, '<h1>Hello, world!</h1>');
  //     });

  //     it('#test GET /path?name=Bob', async() => {
  //       let res = await request(server)
  //         .get('/path?name=Bob')
  //         .expect('Content-Type', /text\/html/)
  //         .expect(200, '<h1>Hello, Bob!</h1>');
  //     });
  //   });
  // });

});
