import { expect } from 'chai';
import 'mocha';

const add = (x: number, y: number): number => {
  return x + y;
};

describe('Test function', () => {
  it('should return: 2', () => {
    const result = add(1, 1);
    expect(result).to.equal(2);
  });
});
