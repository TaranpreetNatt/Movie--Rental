const exercise1 = require('../exercise1');

describe('fizzBuzz', () => {
  it('should return FizzBuzz if the number is divisible by 3 and 5', () => {
    const result = exercise1.fizzBuzz(15);
    expect(result).toMatch('FizzBuzz');
  });
  it('should return Fizz if the number is divisible by 3 and not 5', () => {
    const result = exercise1.fizzBuzz(12);
    expect(result).toMatch('Fizz');
  });
  it('should return Buzz if the number is divisible by 5 and not 3', () => {
    const result = exercise1.fizzBuzz(10);
    expect(result).toMatch('Buzz');
  });
  it('should return the inputed number if the inputed number is divisible by neither 3 or 5 or both', () => {
    const result = exercise1.fizzBuzz(8);
    expect(result).toBe(8);
  });
  it('should throw an exception if input is not a number', () => {
    expect(() => { exercise1.fizzBuzz('a') }).toThrow();
  });
});