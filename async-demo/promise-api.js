
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Async operation 1...');
    resolve(1);
  }, 2000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Async operation 2...');
    resolve(2);
  }, 2000);
});

//Wait for all promises passed to this method in the array to finish
//result is an array
Promise.all([p1, p2])
  .then(result => console.log(result))
  .catch(err => console.log('Error', err.message))

//Resolve the promise when one of the promises in the array finishes
// Promise.race([p1, p2])
//   .then(result => console.log(result))
//   .catch(err => console.log('Error', err.message))