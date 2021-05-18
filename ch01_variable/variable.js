'use strict';

//1. Use strict
//JavaScript is very flexible
//flexible === dangerous
//added ECMAScript 5
//비상식적인 코드를 사용 못하게함.
// 'use strict';
console.log("hello world!");

//2. Variable
//let (added in ES6)

//block scope
{
    let name = 'ellie';
    console.log(name);
    name = 'hello';
    console.log(name);
}
// console.log(name); //error

// var (don't ever use this!)
// var hoisting (move declaration from bottom to top)
// var no block scope
console.log(`age1: ${age}`);
age = 4;
console.log(`age2: ${age}`);
var age;

{
    age = 2;
    var age;
    console.log(`age3: ${age}`);
}
console.log(`age4: ${age}`); //no error

//3.Contant, r(read only)
//use const whenever possible.
//only use let if variable needs to change.
const daysInWeek = 7;
const maxNumber = 5;

//Note!
//Immutable data types: primitive types, frozen objects (i.e. object.freeze())
//Mutable data types: all objects by default are mutable in JS
//favor immutable data type always for a few reasons:
// - security
// - thread safety
// - reduce human mistakes


//4.Variable types
// primitive, single item: number, string, boolean, null, undefiend, symbol
// object, box container
// function, first-class function
const count = 17; //integer
const size = 17.1; //decimal number
console.log(`value: ${count}, type: ${typeof count}`);
console.log(`value: ${size}, type: ${typeof size}`);

// number - special numeric values: infinity, -infinity, Nan
const infinity = 1 / 0;
const negariveInfinity = -1 / 0;
const nAn = 'not a number' / 2;
console.log(infinity);
console.log(negariveInfinity);
console.log(nAn);

//bigInt (fairly new, don't use it yet) n을 붙여줘야한다.
const bigInt = 1234567890123456789012345678901234567890n; // over (-2**53) ~ 2*53)
console.log(`value: ${bigInt}, type: ${typeof bigInt}`);
Number.MAX_SAFE_INTEGER;

//string
const char = 'c';
const brendan = 'brendan';
const greeting = 'hello ' + brendan;
console.log(`value: ${greeting}, type: ${typeof greeting}`);
const helloBob = `hi ${brendan}`; //template literals (string)
console.log(`value: ${helloBob}, type: ${typeof helloBob}`);
console.log('value: ' + helloBob + ' type' + typeof helloBob);

//boolean
// false: 0, null, undefined, Nan, ''
// true: any other value
const canRead = true;
const test = 3 < 1; //false
console.log(`value: ${canRead}, type: ${typeof canRead}`);
console.log(`value: ${test}, type: ${typeof test}`);

//null
let nothing = null;
console.log(`value: ${nothing}, type: ${typeof nothing}`);

//undefined
let x;
console.log(`value: ${x}, type: ${typeof x}`);

//symbol, create unique identifiers for objects
const symbol1 = Symbol('id');
const symbol2 = Symbol('id');
console.log(symbol1 === symbol2);
console.log(`symbol1: ${symbol1.description}`);
console.log(`symbol2: ${symbol2.description}`);

//string이 똑같다면 동일한 symbol을 만들어줘
const gSymbol1 = Symbol.for('id');
const gSymbol2 = Symbol.for('id');
console.log(gSymbol1 === gSymbol2);

//5.Dynamic typing: dynamically typed language
let text = 'hello';
console.log(text.charAt(0));
console.log(`value: ${text}, type:${typeof text}`);
text = 1;
console.log(`value: ${text}, type:${typeof text}`);
text = '7' + 5;
console.log(`value: ${text}, type:${typeof text}`);
text = '8' / '2';
console.log(`value: ${text}, type:${typeof text}`);
// console.log(text.charAt(0)); //error