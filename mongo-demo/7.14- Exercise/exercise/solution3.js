
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
  .then(() => console.log('Connected to database...'))
  .catch((err) => console.log('Error', err));

const courseSchema = mongoose.Schema({
  tags: [ String ],
  date: { type: Date, default: Date.now},
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
  return await Course
    .find( { isPublished: true })
    .or([ 
      { price: { $gte: 15 } }, 
      { name: /.*by.*/i } 
    ])
    .sort('-price')
    .select( 'name author price');
}

async function displayCourses(){
  const courses = await getCourses();
  console.log(courses);
}
displayCourses();