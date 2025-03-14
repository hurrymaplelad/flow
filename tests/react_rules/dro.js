declare const a: $ReactDeepReadOnly<{x: {y: number}}>;
a.x.y = 42; // error
a.x = 42; // error

declare const x: $ReactDeepReadOnly<{x: {a: number}, y: Array<{w: {v: number}}>}>;
const y = x.y;
const z = y[0]
const w = z.w;
const v = w.v;
(v: empty); //error
w.v = 0; // error
x.x.a = 42; // error
x.x.y = []; // error
x.x = (42: any);

declare const rr: $ReactDeepReadOnly<{current: number}>;
rr.current = 42; // ok

declare const w3: $ReactDeepReadOnly<{a: {b: number}, c: number}>;
const w2 = {...w3};
w2.c = 42; // ok
w2.a.b = 42; // error

declare const v3: $ReactDeepReadOnly<Array<{a: number}>>;
const v2 = [...v3];
v2[0] = {a: 42}; // ok
v2[1].a = 42; //error

import * as React from 'react';

component Foo1(x: { y: number}) {
    x.y = 42 // error;
    return null;
}
component Foo2(...rest: {bar: number, baz: Array<string>, qux:[number, Array<string>]}) {
    rest.bar = 42; // error;
    rest.baz.push("hello"); // error
    rest.qux[0] = 42; // error
    rest.qux[1].pop(); // error
    return null;
}

component A(x: {bar: number}) { return <A x={x} />; }; // ok

export type Union = 'A' | 'B';

component UnionToElemTShortcut(
    key: Union,
    data: {
      [key: Union]: {
        prop?: number,
      },
    },
  ) {
    const obj = data[key];
    obj.prop = 0; // error
    return null;
}

declare const droset: React$Immutable<Set<Set<number>>>;
droset.add(new Set()); // error
droset.add((42: any)); // error
droset.forEach(x => x.add(42)) // error

droset as Set<Set<number>> as typeof droset // error

declare const dromap: React$Immutable<Map<{x: number}, Map<{y: number}, number>>>;
dromap.set({x: 42}, new Map()); // error
dromap.set({x: 42}, (42: any)); // error
dromap.forEach((val, key) => {
  key.x = 42; // error
  val.set({y: 420}, 42) // error
});

class CoolClass {
  prop: {x: number};
}

declare const drc: React$Immutable<CoolClass>;
drc.prop.x = 42 // error;
drc.prop = {x: 42}; // error;

declare const droarr: React$Immutable<Array<Array<number>>>;
droarr.push([]); // error
droarr[0].push(42); // error
droarr.at(0)?.push(42) // error;

declare hook useMyReducer<S, A>(
  reducer: (React$Immutable<S>, A) => React$Immutable<S>,
  initialState: S,
): [S, Dispatch<A>];

declare hook useMyReducerWithNoState<S, A>(
  reducer: (React$Immutable<S>, A) => React$Immutable<S>,
): [S, Dispatch<A>];

declare type Dispatch<A> = (A) => void;
declare function badReducer(state: Array<number>, action: any): Array<number>;
declare function goodReducer(state: React$Immutable<Array<number>>, action: any): Array<number>

component Foo() {
  useMyReducer(badReducer, [1]); // error
  useMyReducerWithNoState<Array<number>, _>(badReducer); // error
  useMyReducerWithNoState(badReducer); // error
  useMyReducer(goodReducer, [1]); // ok
  useMyReducerWithNoState<Array<number>, _>(goodReducer); // ok
  useMyReducerWithNoState(goodReducer); // ok

  useMyReducer((arr, act: any) => { arr.push(42); return arr }, [0]); // error
  useMyReducer((arr, act: any) => { return arr }, [0]); // ok
  return null;
}

droarr as $ReadOnlyArray<$ReadOnlyArray<number>> // fine
droarr as $ReadOnlyArray<Array<number>> // error

droset as $ReadOnlySet<$ReadOnlySet<number>> // fine
droset as $ReadOnlySet<Set<number>> // error

type T = $ReadOnlyArray<T>;
declare const recarr: React$Immutable<T>;
recarr as T;

declare const droobj: React$Immutable<{x: Array<number>}>;
droobj.x.push(42); // error
droobj.x = []; // error

droobj as {+x: Array<number>}; // error
droobj as {+x: $ReadOnlyArray<number>}; // ok

component WriteToComponentProperty(x: {}) {
  x.constructor = () => {}; // error cannot write to constructor property
  return null;
}

{
  type M = { x: number };
  type N = $ReadOnlyArray<M>;
  type O = { n: N };
  declare const obj: React$Immutable<O>;
  ({ n: obj.n }) as React$Immutable<O>; // ok
}

component NonInterferenceWithInference(arr: Array<number>) {
  arr.sort((a, b) => { // only dro error
      return 1;
  });
  return null;
}
