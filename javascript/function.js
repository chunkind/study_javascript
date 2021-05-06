//Function
//- fundamental building block in the program
//- subprogram can be used multiple times
//- performs a task or calculates a value

//1.Function declaration
//function name(param1, param2..){ body... reutnr; }
//one function === one thing
//naming: doSomething, command, verb
//e.g. createCardAndPoint -> createCard, createPoint
//function is object in JS
function printHello(){
    console.log('Hello');
}
printHello();

function log(message){
    console.log(message);
}
log('Hello@');

//2. Parameters
//premitive parameters: passed by value
//object parameters: passed by reference
function changeName(obj){
    obj.name = 'coder';
}
const ck = {name:'ck'};
changeName(ck);
console.log(ck);

//3. Default parameters (added in ES6)
function showMessage(message, from = 'unknown'){
    console.log(`${message} by ${from}`);
}

showMessage("Hi!");

//4. Rest parameters (added in ES6)
function printAll(...args){
    for(let i = 0; i < args.length; i++){
        console.log(args[i]);
    }

    for(const arg of args){
        console.log(arg);
    }

    args.forEach((arg) => console.log(arg));
}
printAll('dream', 'coding', 'ck');

//5. Local scope
let globalMessage = 'global'; // global variable
function printMessage(){
    let message = 'hello';
    console.log(message);
    console.log(globalMessage);
    function printAnother(){
        console.log(message);
        let childMessage = 'hello';
    }
    //console.log(childMessage); //Error
}
printMessage();
//console.log(message); //Error

//밖에서는 안이 보이지 않고 안에서만 밖을 볼 수 있다.
//클로져 : 자식의 함수가 보모함수에 정의된 변수에 접근이 가능한 것.

//6. Return a value
//모든 함수는 return undefined 이거나 값을 리턴한다.
function sum(a, b){
    return a + b;
}
const result = sum(1, 2); //3
console.log(`sum: ${sum(1,2)}`);

//7. Early return, early exit
//bad
function upgradeUser(user){
    if(user.point > 10){
        //long upgrade login...
    }
}

//good
function upgradeUserGood(user){
    if(user,point <= 10){
        return;
    }
    //long upgrade logic...
}

//First-class function
//function are treated like any other variable
//can be assigned as a value to variable
//can be passed as an argument to other functions.
//can be returned by another function

//1. Function expression
//a function declaration can be called earlier than it is defined. (hoisted)
//a function expression is created when the executeion reaches it.
const print = function(){ //anonymous function
    console.log('print');
};
print();
const printAgain = print;
printAgain();
const sumAgain = sum;
console.log(sumAgain(1,3));

//2. Callback function using function expression
function randomQuiz(answer, printYes, printNo){
    if(answer === 'love you'){
        printYes();
    } else {
        printNo();
    }
}
//anonymous function
const printYes = function(){
    console.log('yes!');
}
//named function
//better debugging in debugger's stack traces
//recursions
const printNo = function print(){
    console.log('no!');
    //recursions
    //print();
}
randomQuiz('wrong', printYes, printNo);
randomQuiz('love you', printYes, printNo);


// Arrow function
//always anonymous
const simplePrint = function(){
    console.log('simplePrint!');
};

const simplePrint2 = () => console.log('simplePrint!');
const add = (a, b) => a + b;
const simpleMultiply = (a, b) => {
    //do something more
    return a * b;
};

// IIFE: Immediately Invoked Function Expression
(function hello(){
    console.log("IIFE");
})();
