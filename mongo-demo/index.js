
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/
  },
  category: {
    type: String,
    required: true,
    enum: [ 'web', 'mobile', 'network'],
    lowercase: true,
    // uppercase: true,
    trim: true // mongoose automatically removes padding around the string.
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(value, callback){
        setTimeout(() => {
          // Do some async work
          const result = value && value.length > 0;
          callback(result);
        });
      },
      message: 'A course must have at least one tag.'
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: { 
    type: Number,
    required: function() {return this.isPublished },
    min: 10,
    max: 200,
    get: value => Math.round(value), // called when the price property is read.
    set: value => Math.round(value) // called when the price property is set, setter function will be called
  }
});

const Course = mongoose.model('Course', courseSchema);

  // COMPARISON OPERATORS
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  // Logical operators
  // or
  // and

  // Regular Expressions
  // /pattern/
  // ex. .find({ author: /^Mosh/ }) Starts with Mosh, this is case sensitive
  // ex. .find({ author: /Hamedani$/ }) Ends with Hamedani, again this is case sensitive
  // ex. .find( {author: /Hamedani$/i }) Ends with Hamedani, this is not case sensitive because of the /i
  // ex. .find({ author: /.*Mosh.*/ }) Contains Mosh

async function createCourse(){
  const course = new Course({
    name: 'Angular.js Course',
    category: 'Web',
    author: 'Mosh',
    tags: 'frontend',
    isPublished: true,
    price: 15.8
  });
  try{
    const result = await course.save();
    console.log(result)
  }
  catch(ex){
    for(field in ex.errors){
      console.log(ex.errors[field].message);
    }
  }
}

async function getCourses(){
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course
    .find({ _id: '5d564921f9ebf3299d00642b'})
    //.find({ price: { $gte: 10, $lte: 20 } }) // 10 <= price <= 20 // comparison operator
    //.find({ price: {$in: [10, 15, 20] } })   // price is either 10, 15, 20 // comparison operator
    //.find()
    //.or([ { author: 'Mosh' }, { isPublished: true } ]) // find courses either authored by Mosh or are published
                                                       // the and operator syntax is the same as the or operator syntax
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)                                         
    .sort({ name: 1 })
    .select({ name: 1, tags: 1, price: 1 });
    //.count(); // counts the number of documents in the database
  console.log(courses[0].price);
}

async function updateCourse(id) {
  // // Approach1: Query first
  // // findById()
  // // Modify its properties
  // // then call the class.save() function

  // *******************************************************//
  // const course = await Course.findById(id);
  // if (!course) return;
  // course.isPublished = true;
  // course.author = 'Another Author';

  // const result = await course.save();
  // console.log(result);
  // *******************************************************//

  // // Approach2: Update first
  // // Update directly
  // // Optionally: get the updated document

  //*******************************************************//
  // const result = await Course.update({ _id: id }, {
  //   $set: {
  //     author: 'Mosh',
  //     isPublished: false,
  //   }
  // }); // first parameter is a query, // second parameter is the update object
  // console.log(result);
  //********************************************************//

  // // if you want the object returned and updated instead of just updated
  // *********************************************************************************************************************//
  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Jason',
      isPublished: false,
    }
  }, { new: true }); // first parameter is an id, second parameter is the update object, third parameter is an option
  console.log(course);
  // **********************************************************************************************************************??
}

async function removeCourse(id) {
  // const result = await Course.deleteOne( { _id: id }); // deletes one document in the database
  // const course = await Course.deleteMany({ _id: id }); // deletes multiple documents, in this case it only deletes the one
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

getCourses();