/**
 * 기본 타입과 참조 타입의 비교 연산.
 * 기본 타입의 경우 동등 연산자(==)를 이용해서 비교할때 값을 비교한다.
 * 객체 비교는 동등 연산자(==) 이용해서 비교할때 참조값의 객체를 비교한다.
 */

var a = 100;
var b = 100;

var objA = { value: 100 };
var objB = { value: 100 };
var objC = objB;

console.log(a == b); //true
console.log(objA == objB); //false
console.log(objB == objC); //true