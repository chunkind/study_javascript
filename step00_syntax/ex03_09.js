/**
 * 동일한 객체를 참조하는 두 변수 objA와 objB
 */
var objA = {
    val : 40
}
var objB = objA;

console.log(objA);
console.log(objB);

objB.val = 50; //값이 둘다 바뀜.
console.log(objA);
console.log(objB);