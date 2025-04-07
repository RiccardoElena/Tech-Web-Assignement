// Exercise 1

function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

let person1 = new Person('John', 'Doe');
let person2 = new Person('Jane', 'Smith');

Person.prototype.greet = function () {
  console.log(`Hello, I'm ${this.firstName} ${this.lastName}.`);
};

/* What happens when greet is called on person1 or person2?

  The method is searched the object itself first, and if not found,
  it is searched in the prototype and found there.
*/

person1.greet();
person2.greet();

function Student(firstName, lastName, degreeProgram) {
  Person.call(this, firstName, lastName);
  this.degreeProgram = degreeProgram;
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

let student1 = new Student('Alice', 'Johnson', 'Computer Science');
let student2 = new Student('Bob', 'Brown', 'Computer Science');

student1.greet();
student2.greet();

/* What happens when greet is called on student1 or student2?

  The method is searched the object itself first, and if not found,
  it is searched in the prototype and
*/

Student.prototype.greet = function () {
  console.log(
    `Hello! I’m ${this.firstName} ${this.lastName} and I’m a ${this.degreeProgram} student`
  );
};
console.log();
person1.greet();
person2.greet();
student1.greet();
student2.greet();

// Exercise 2
const createMultiStepFilterer = (array) => {
  return (filter) => {
    try {
      array = array.filter(filter);
    } catch {}
    return array;
  };
};

let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let filterer = createMultiStepFilterer(array);

console.log(filterer());

console.log(
  filterer(function (elem) {
    return elem % 2 !== 0; //remove elements that are even
  })
);

console.log(filterer('Foo'));

console.log(
  filterer(function (elem) {
    return elem % 3 !== 0; //remove elements that are also multiple of three
  })
);

console.log(array);

// Exercise 3

Array.prototype.myFilter = function (callback) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

const createMultiStepFilterer2 = (array) => {
  return (filter) => {
    try {
      array = array.myFilter(filter);
    } catch {}
    return array;
  };
};

let array2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
let filterer2 = createMultiStepFilterer(array2);

console.log(filterer2());

console.log(
  filterer2(function (elem) {
    return elem % 2 !== 0; //remove elements that are even
  })
);

console.log(filterer2('Foo'));

console.log(
  filterer2(function (elem) {
    return elem % 3 !== 0; //remove elements that are also multiple of three
  })
);

console.log(array2);
