const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

// // One way to update a sub document
// async function updateAuthor(courseId) {
//   const course = await Course.findById(courseId);
//   course.author.name = 'Mosh Hamedani';
//   course.save();
// }

// // Updating a sub document directly in the database
// async function updateAuthor(courseId) {
//   const course = await Course.update({ _id: courseId}, {
//     $set: {
//       'author.name': 'John Smith'
//     }
//   });
// }

// Removing a sub document or a part of a sub document from a database
async function updateAuthor(courseId) {
  const course = await Course.update({ _id: courseId}, {
    $unset: {
      'author': ''
    }
  });
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

// createCourse('Node Course', [
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'Johnn' })
// ]);

// updateAuthor('5d59232c515c4566d085764c');

// addAuthor('5d5a3c4f2bbbd16f7e619c7f', new Author({ name: 'Amy' }));

removeAuthor('5d5a3c4f2bbbd16f7e619c7f', '5d5a3ce186d97c6fd104fb0f');