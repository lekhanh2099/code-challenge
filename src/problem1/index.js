// Provide 3 unique implementations of the following function in JavaScript.

// **Input**: `n` - any integer

// *Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

// **Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

// Negative n sums -1 down to n; zero returns 0.
// Recursion halves n each time, so its call stack grows logarithmically.

// Approach 1: Loop
var sum_to_n_a = function (n) {
 let sum = 0;

 if (n >= 0) {
  for (let i = 1; i <= n; i++) {
   sum += i;
  }
 } else {
  for (let i = -1; i >= n; i--) {
   sum += i;
  }
 }

 return sum;
};

// Approach 2: Recursion
var sum_to_n_b = function (n) {
 if (n === 0) {
  return 0;
 }

 if (n < 0) {
  return -sum_to_n_b(-n);
 }

 const half = Math.floor(n / 2);
 const halfSum = sum_to_n_b(half);
 // S(2k) = 2*S(k) + k²; for odd n, add the last term.
 const evenSum = 2 * halfSum + half * half;
 return n % 2 === 0 ? evenSum : evenSum + n;
};

// Approach 3: Formula
var sum_to_n_c = function (n) {
 if (n >= 0) {
  return (n * (n + 1)) / 2;
 }

 return (n * (1 - n)) / 2;
};

module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
