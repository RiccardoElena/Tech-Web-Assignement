'use strict';

// Exercise 1

let studentName = 'Riccardo Elena';

let age = 21;

let isEnrolled = true;

console.log(`${studentName}: ${typeof studentName}`);
console.log(`${age}: ${typeof age}`);
console.log(`${isEnrolled}: ${typeof isEnrolled}`);

let studentInfo = (studentName, age, course, isEnrolled) => {
  return `${studentName} (${age}) is ${
    isEnrolled ? '' : 'NOT'
  } enrolled in the ${course} course`;
};

console.log(studentInfo(studentName, age));
console.log(studentInfo(studentName, age, 'Tech Web', isEnrolled));

// Exercise 2

let director = {
  firstName: 'Peter',
  lastName: 'Jackson',
  birthYear: 1961,
  deathYear: null,
  info() {
    return `${this.firstName} ${this.lastName} ( ${this.birthYear} - ${
      this.deathYear ?? 'alive'
    } )`;
  },
};

let movie = {
  title: 'The Lord of the Rings: The Fellowship of the Ring',
  director: director,
  year: 2001,
  'is part of a saga': true,
  describe() {
    return `"${this.title}" is a ${
      this.year
    } movie directed by ${this.director.info()}, ${
      this['is part of a saga'] ? '' : 'not'
    } part of a saga`;
  },
};

console.log(movie.describe());

function Movie(title, director, year, isInSaga = true) {
  this.title = title;
  this.director = director;
  this.year = year;
  this['is part of a saga'] = isInSaga;
  this.describe = () => {
    return `"${this.title}" is a ${
      this.year
    } movie directed by ${this.director.info()}, ${
      this['is part of a saga'] ? '' : 'not'
    } part of a saga`;
  };
}

let movie2 = new Movie('The Lord of The Rings: The Two Towers', director, 2002);

console.log(movie2.describe());

delete movie['is part of a saga'];

console.log(movie2['is part of a saga']);
console.log(movie['is part of a saga']);

function Trilogy(title, movie1, movie2, movie3) {
  this.title = title;
  this.movie1 = movie1;
  this.movie2 = movie2;
  this.movie3 = movie3;
  this.describe = () => {
    return `"${this.title}" is a trilogy that includes "${this.movie1.title}", "${this.movie2.title}" and "${this.movie3.title}"`;
  };

  this.describeFull = () => {
    return (
      this.describe() +
      '.\n' +
      this.movie1.describe() +
      '\n' +
      this.movie2.describe() +
      '\n' +
      this.movie2.describe()
    );
  };
}

let lotrSaga = new Trilogy(
  'The Lord of the Rings',
  movie,
  movie2,
  new Movie('The Lord of the Rings: The Return of the King', 2003, director)
);

console.log(lotrSaga.describe());
console.log(lotrSaga.describeFull());

// Excercise 3

let collatzTime = (coll, max) => {
  console.time('Collatz Time');
  for (let n = 2; n <= max; n++) {
    let s = coll(n);
    console.log(
      `Collatz proved for n=${n}: sequence converges to 1 in ${s} steps`
    );
  }
  console.log(`Collatz proved in the intervall [2,${max}]`);
  console.timeEnd('Collatz Time');
};

let versions = [
  {
    name: 'Naïve',
    collatz(n) {
      let steps = 0;
      while (n != 1) {
        steps++;
        n = n % 2 === 0 ? n / 2 : 3 * n + 1;
      }
      return steps;
    },
  },
  {
    name: 'Dinamic',
    collatzCache: [],
    collatz(n) {
      let i = n;
      let steps = 0;
      while (i != 1) {
        let cachedSteps = this.collatzCache[i];
        if (cachedSteps) {
          this.collatzCache[n] = steps + cachedSteps;
          return this.collatzCache[n];
        }
        steps++;
        i = i % 2 === 0 ? i / 2 : 3 * i + 1;
      }
      this.collatzCache[n] = steps;
      return steps;
    },
  },
  {
    name: 'Super Optimized',
    collatzCache: [],
    collatz(n) {
      if (n == 2) {
        this.collatzCache[2] = 1;
        return this.collatzCache[2];
      }
      if (this.collatzCache[n]) {
        return this.collatzCache[n];
      }

      this.collatzCache[n] =
        1 + (n % 2 == 0 ? this.collatz(n / 2) : this.collatz(3 * n + 1));
      return this.collatzCache[n];
    },
  },
];

for (const v of versions) {
  console.log(`\n${v.name} version\n`);
  collatzTime(v.collatz.bind(v), 10000);
}

// Excercise 4

function f() {
  let value = Math.random();
  console.log(`f has been invoked, result is ${value}`);
  return value;
}

function cachingDecorator(f, n) {
  let count = 0;
  let cache = 0;
  return () => {
    if (!count || count === n) {
      cache = f();
      count = 1;
      return cache;
    } else {
      count++;
      return cache;
    }
  };
}
let h = cachingDecorator(f, 2);
let g = cachingDecorator(f, 3);

/* 
  !IMPORTANT!
  The expected output from the assignement is not obtainable perfectly.
  The problem is in the fact that the times f is called the expected printed
  output is only the print from f, but the line 
  ```
  console.log(g())
  ```
  will print the return of g() too (if there's no return it'll print "undefined").
  I think the best fit is the solution I provided, so that that at least the
  extra print is an empty line.
*/

console.log(g()); //f has been invoked, result is 0.123123123
console.log(g()); //0.123123123
console.log(g()); //0.123123123
console.log(g()); //f has been invoked, result is 0.456456456
console.log(g()); // 0.456456456
console.log(g()); // 0.456456456
console.log('Switching to h');
console.log(h());
console.log(h());
console.log(h());
console.log(h());
console.log(h());
console.log(h());
console.log(h());
console.log(h());
console.log(h());
