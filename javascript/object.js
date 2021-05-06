// Objects
// one of the JavaScript's data types.
// a collection of related data and/or functionality.
// Nearly all objects in JavaScript are ainstances of Object
// object = {key : value}

// 1.Literals and properties
const obj1 = {}; // 'object literal' syntax
const obj2 = new Object(); // 'object constructor' syntax

function print(person){
    console.log(person.name);
    console.log(person.age);
}

const ellie = {name:'ellie', age:4};
print(ellie);

// with JavaScript magic (dynamically typed language)
// can add properties later
ellie.hasJob = true;
console.log(ellie.hasJob);

delete ellie.hasJob;
console.log(ellie.hasJob);

// 2. Computed properties
// key should be always string
console.log(ellie.name);
console.log(ellie['name']);
ellie['hasJob'] = true;
console.log(ellie.hasJob);

function printValue(obj, key){
    console.log(obj[key]);
}
printValue(ellie, 'name');


// 3. Property value shorthand
const person1 = { name: 'bob', age: 2};
const person2 = { name: 'steve', age: 2};
const person3 = { name: 'dave', age: 2};
const person4 = makePerson('ellie', 30);
console.log(person4);
function makePerson(name, age){
    return{
        name,
        age
    }
}

// 4. Constructor function
const person5 = new Person('ck', 34);
function Person(name, age){
    //this = {};
    this.name = name;
    this.age = age;
    //return this;
}

// 5. in operator: perperty existence check (key in obj)
console.log('name' in ellie); //true
console.log('age' in ellie); //true
console.log('random' in ellie); //false
console.log(ellie.random); //undefined

// 6. for..in vs for..of
// for(key in obj)
console.clear();
for(key in ellie){
    console.log()
}

// for (value of interable)
const array = [1, 2, 4, 5];
for(let i = 0; i < array.length; i++){
    console.log(array[i]);
}

for(value of array){
    console.log(value);
}

// 7. Fun cloning
// Object.assign(dest, [obj1, obj2, obj3...])
const user = { name: 'ellie', age: '20' };
const user2 = user;
user2.name = 'coder';
console.log(user);
//ref가 같음

//old way
const user3 = {};
for(key in user){
    user3[key] = user[key];
}
console.log(user3);

const user4 = {};
Object.assign(user4, user);
console.log(user4);

const user5 = Object.assign({}, user);

// another example
const fruit1 = { color: 'red'};
const fruit2 = { color: 'blue', size: 'big'};
let mixed = Object.assign({}, fruit1, fruit2);
console.log(mixed.color);
console.log(mixed.size);

mixed = Object.assign({}, fruit2, fruit1);
console.log(mixed.color);
console.log(mixed.size);