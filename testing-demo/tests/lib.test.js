const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () => {
  it('should return a positive number if input is positive', () => {
    const result = lib.absolute(1);
    expect(result).toBe(1); // to be compares the memory locations as well
  });

  it('should return a positive number if input is negative', () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it('should return a 0 number if input is 0', () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

describe('greet', () => {
  it('should return the greeting message', () => {
    const result = lib.greet('Mosh');
    expect(result).toMatch(/Mosh/);
    // expect(result).toContain('Mosh'); // if you don't want to use regular expressions
  });
});

describe('getCurrencies', () => {
  it('should return supported currencies', () => {
    const result = lib.getCurrencies();

    // Too general
    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    // Too specific
    expect(result[0]).toBe('USD');
    expect(result[1]).toBe('AUD');
    expect(result[2]).toBe('EUR');
    expect(result.length).toBe(3);

    // Proper way
    expect(result).toContain('USD');
    expect(result).toContain('AUD');
    expect(result).toContain('EUR');

    // Ideal way
    expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']));
  });
});

describe('getProduct', () => {
  it('should return the product with the given id', () => {
    const result = lib.getProduct(1);
    // expect(result).toEqual({id: 1, price: 10}); // This tests the object has exactly these two properties
    expect(result).toMatchObject({id:1, price: 10});  // This test checks if the object contains id: 1, price:10
  })
});

describe('registerUser', () => {
  it('should throw if username is falsy', () => {
    // Null
    // undefined
    // NaN
    // ''
    // 0
    // false
    const args = [null, undefined, NaN, '', 0, false];
    args.forEach(a => {
      expect(() => { lib.registerUser(null) }).toThrow();
    });
  })
  it('should return a user object if valid username is passed', () => {
    const result = lib.registerUser('Mosh');
    expect(result).toMatchObject({ username: 'Mosh' });
    expect(result.id).toBeGreaterThan(0);
  });
});

describe('applyDiscount', () => {
  it('should give the customer a 10% discount if the customer has more than 10 points', () => {
    // Set this function to a fake function in order to unit test without dependency
    // in this case without having to read from the database.
    db.getCustomerSync = function(customerId) {
      console.log('Fake reading customer...');
      return { id: customerId, points: 20};
    }

    const order = { customerId: 1, totalPrice: 10};
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
});

describe('notifyCustomer', () => {
  it('should send an email to the customer', () => {
    db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });
    mail.send = jest.fn()

    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled();
    expect(mail.send.mock.calls[0][0]).toBe('a');         // checks arg
    expect(mail.send.mock.calls[0][1]).toMatch(/order/);  // checks arg
  });
});


// toHaveBeenCalled() this matcher checks if the function has been called
// toHaveBeenCalledWIth() If you want to check the arguments that have been passed to that method

// Jest Mock function
// const mockFunction = jest.fn();
// mockFunction.mockReturnValue(1);  // Returns the value of 1
// mockFunction.mockResolvedValue(1); // Returns a promise 
// mockFunction.mockRejectedValue(new Error('...')); // returns an error that will be caught in the catch block
// const result = await mockFunction();