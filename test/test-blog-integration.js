const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);


function seedBlogData() {
  console.info('seeding blog data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push({
      author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      title: faker.lorem.sentence(),
      content: faker.lorem.text()
    });
  }
  return BlogPost.insertMany(seedData);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Blog Post API', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBlogData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });


  describe('GET endpoint', function() {

    it('should return all posts', function() {
      let res;
      return chai.request(app)
        .get('/posts')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.posts.should.have.length.of.at.least(1);
          return BlogPost.count();
        })
        .then(function(count) {
          res.body.posts.should.have.length.of(count);
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new blog post', function() {
      const newBlogPost = {
        author: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName()
        },
        title: faker.lorem.sentence(),
        content: faker.lorem.text()
      };

      return chai.request(app)
        .post('/posts')
        .send(newBlogPost)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'author', 'title', 'content', 'dateCreated');
          res.body.title.should.equal(newBlogPost.title);
          res.body.content.should.equal(newBlogPost.content);
          res.body.id.should.not.be.null;
          res.body.author.should.equal(`${newBlogPost.author.firstName} ${newBlogPost.author.lastName}`);
          return BlogPost.findById(res.body.id).exec();
        })
        .then(function(post) {
          post.title.should.equal(newBlogPost.title);
          post.content.should.equal(newBlogPost.content);
          post.author.firstName.should.equal(newBlogPost.author.firstName);
          post.author.lastName.should.equal(newBlogPost.author.lastName);
        });
    });
  });

  describe('PUT endpoint', function() {
    it('should update a specified already existing blog post', function() {

    });
  });

  describe('DELETE endpoint', function() {
    it('should remove a specified blog post', function() {

    });
  });

});
