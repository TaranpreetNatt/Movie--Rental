
// Trade off between query performance vs consistency


// Using References (Normalization) -> CONSISTENCY
let author = {
  name: 'Mosh'
}

let course = {
  author: 'id'
}

// Using Embedded Documents (Denormalization) -> PERFORMANCE

let course = {
  author: {
    name: 'Mosh'
  }
}

// Hybrid

let author = {
  name: 'Mosh'
}

let courses = {
  author: {
    id: 'ref',
    name: "Mosh"
  }
}