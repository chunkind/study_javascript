//객체 리터럴을 통한 foo 객체 생성
/**
 * for in 문을 통한 객체 프로퍼티 출력.
 */
var foo = {
    name: 'foo',
    age: 30,
    major: 'computer science'
}

//for in 문을 이용한 객체 프로터피 출력
var prop;
for(prop in foo){
    console.log(prop, foo[prop]);
}

foo = {
    name: 'foo',
    nickname: 'babo'
}

console.log(foo);

delete foo.nickname;

console.log(foo);
console.log(foo.nickname); //undefined

delete foo;
console.log(foo); //삭제 안됨.. 객체는 삭제할수 없다. 프로퍼티만 삭제 가능.
