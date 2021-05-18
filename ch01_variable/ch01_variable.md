#1. Use strict
자바스크립트는 매우 유연하다. 유연함은 위험할 수도 있다. 일반 개발자들이 상식적으로 생각했던 문법들이 자바스크립트에서는 깨질수 있다. 예를 들면 아래와 같다.

```javascript
a = "안녕";
```

위와 같이 변수 선언도 없이 바로 할당하여도 자바스크립트 내부적으로는 에러 없이 생성한다. 저런 코드는 작성할때는 편하긴 하겠지만 매우 위험한 코드가 될 수 있다. 다른 곳에서 이미 사용한 변수인지 이제 막 생성한 변수 인지 알 수 없기 때문이다.

#2. Block Scope

```javascript
{
  let name = "ck";
  name = "kc";
  console.log(name);
}
```

위와 같이 자바스크립트에서는 스코프(범위)를 만들 수 있다. 코드 블럭 안에 선언된 변수는 블럭 안에서만 사용 할 수 있다.

```javascript
{
  let name = "ck";
  name = "kc";
}
console.log(name);
```

이렇게 블럭 밖에서 참조한다면 "name is not defined" 에러를 만날 것이다.

#3. var의 특징
호이스팅되고 블럭스코프를 허용하지 않는다.

```javascript
console.log(`age1: ${age}`); //undefined
age = 4;
console.log(`age2: ${age}`); //4
var age;

{
  age = 2;
  var age;
  console.log(`age3: ${age}`); //2
}
console.log(`age4: ${age}`); //2
```

# 4.Contant, r(read only)

const는 변경 불가능한 데이터를 담는다. 한번 담으면 끝!
이와 같은 변수를 사용하는 이유는

- security
- thread safety
- reduce human mistakes

# 5.변수 타입

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
const bigInt = 1234567890123456789012345678901234567890n; // over (-2\**53) ~ 2*53)
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
