import { registry } from "../src/container";
import { IRegisterable, ITestableContainer } from "../src/types/types.containers";
import * as fs from 'fs';

function getRandomNumber(max?: number, min?: number) {
    return Math.floor(Math.random() * (max ?? 100) + (min ?? 1));
}

describe('the registry', () => {
    let testable: ITestableContainer = null as any;
    const environment: ITestableContainer = registry as ITestableContainer;

    beforeEach(() =>{
        testable = environment.buildTestable();
    });

    it('should create a testable version for tests', () => {
        expect(testable).not.toBe(environment);
    });

    it('should throw an exception when building something that has not been registered', () => {
        expect(() => testable.build('bad module')).toThrow('Build failed: No module named \'bad module\' is registered.');
    });

    it('should restoreAll replaced modules', () => {
        let fnOne = jest.fn()
        let fnTwo = jest.fn()
        let fnThree = jest.fn();

        let fnFakeOne = jest.fn();
        let fnFakeTwo = jest.fn();
        let fnFakeThree = jest.fn();

        testable.
            registerBuilder(() => { fnOne(); }, [], 'one').
            registerBuilder(() => { fnTwo(); }, ['one'], 'two').
            registerBuilder(() => { fnThree(); }, ['two'], 'three');

        testable.
            replaceBuilder(() => { fnFakeOne(); }, [], 'one').
            replaceBuilder(() => { fnFakeTwo(); }, ['one'], 'two').
            replaceBuilder(() => { fnFakeThree(); }, ['two'], 'three');

        testable.restoreAll();

        testable.build('three');

        expect(fnFakeOne).not.toHaveBeenCalled();
        expect(fnFakeTwo).not.toHaveBeenCalled();
        expect(fnFakeThree).not.toHaveBeenCalled();

        expect(fnOne).toHaveBeenCalled();
        expect(fnTwo).toHaveBeenCalled();
        expect(fnThree).toHaveBeenCalled();
    });

    it('should return a list of all registered modules.', () => {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', ' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        let holding: any[] = [];
        const numberOfNames = getRandomNumber(12);
        function randomName() {
            const cnt = getRandomNumber(10);
            let name = "";
            for (let index = 0; index < cnt; index++) {
                const letter = getRandomNumber(letters.length - 1, 0);
                name+=letters[letter];
            }
            return name;
        }

        for (let index = 0; index < numberOfNames; index++) {
            holding.push(randomName());
        }

        let names: string[] = [];

        holding.forEach(name => {
            if(!names.includes(name)) {
                names.push(name);
            }
        });

        names.forEach(name => {
            testable.registerBuilder(() => {return {};}, [], name);
        });

        let modules = testable.getModuleList();

        names.forEach(name => {
            expect(modules).toContain(name);
        });
    });

    it('should be able to build a default node package', () => {
        let fst = testable.build('fs');

        expect(fst.constants.X_OK).toBe(fs.constants.X_OK);
    });

    describe('Module Registration', () => {
        it('registration validation requires valid name', () => {
            let registerable: any = {
                builder: function test() { return {}; },
                name: null,
            };
    
            expect(() => { testable.register(registerable); }).toThrow('Registration failed: Module name is required.');
        });

        it('registered item building calls function correctly', () => {
            let fn = jest.fn();
            const expected = { value: 'hello' };
            let registerable: IRegisterable = {
                builder: function testRegister(...args: any[]) { fn(...args); return expected; },
                name: 'testRegister',
            };
    
            testable.register(registerable);
            let result = testable.build('testRegister');
    
            expect(fn).toHaveBeenCalledWith();
            expect(result).toBe(expected);
        });
    
        it('dependency resolution builds dependencies correctly', () => {
            let fnBlue = jest.fn();
            let fnOrange = jest.fn();
    
            const blueValue = {
                value: 'blue',
                sTax: 55,
            }
    
            const orangeValue = {
                name: 'orange thing',
                printIt: function (v: string) {
                    console.log(v);
                },
            }
    
            let blue: IRegisterable = {
                builder: function blue(...args: any[]) { fnBlue(...args); return blueValue; },
                name: 'blue',
            };
    
            let orange: IRegisterable = {
                builder: function orange(...args:any[]) { fnOrange(...args); return orangeValue; },
                name: 'orange',
                dependencies: [ 'blue' ],
            };
    
            testable.
                register(blue).
                register(orange);
    
            let orangeResult = testable.build('orange');
    
            expect(fnBlue).toHaveBeenCalledWith();
            expect(fnOrange).toHaveBeenCalledWith(blueValue);
    
            expect(orangeResult).toBe(orangeValue);
        });
    
        it('circular dependency detection produces error', () => {
            let blue: IRegisterable = {
                builder: function blue() {},
                name: 'blue',
                dependencies: ['orange']
            };

            let orange: IRegisterable = {
                builder: function orange() {},
                name: 'orange',
                dependencies: ['blue']
            };
    
            testable.
                register(blue).
                register(orange);
    
            expect(() => { testable.build('orange'); }).toThrow('Build failed: Circular dependency detected: "orange" => "blue" => "orange".');
        });

        it('non-singleton builders execute multiple times', () => {
            let fn = jest.fn();
            let registerable: IRegisterable = {
                builder: function cat() { fn(); return {}; },
                name: 'cat',
            };
    
            testable.register(registerable);
    
            let iterationCnt = getRandomNumber();
            for (let index = 0; index < iterationCnt; index++) {
                testable.build('cat');
            }
    
            expect(fn).toHaveBeenCalledTimes(iterationCnt);
        });

        it('shared dependencies resolve without circular error', () => {
            const orangeValue = {
                value: 32,
                text: 'orange'
            };
            
            let blue: IRegisterable = {
                builder: function blue() {},
                name: 'blue',
                dependencies: ['purple'],
            };

            let orange: IRegisterable = {
                builder: function orange() { return orangeValue; },
                name: 'orange',
                dependencies: ['blue', 'green'],
            };

            let green: IRegisterable = {
                builder: function green() {},
                name: 'green',
                dependencies: ['purple']
            };

            let purple: IRegisterable = {
                builder: function purple() {},
                name: 'purple',
            };
    
            testable.
                register(purple).
                register(green).
                register(blue).
                register(orange);
    
            expect(testable.build('orange')).toBe(orangeValue);
        });
    
        it('singleton builders execute only once', () => {
            let fn = jest.fn();
            let registerable: IRegisterable = {
                builder: function cat() { fn(); return {}; },
                name: 'cat',
                singleton: true,
            };
    
            testable.register(registerable);
    
            let iterationCnt =  getRandomNumber();
            for (let index = 0; index < iterationCnt; index++) {
                testable.build('cat');
            }
    
            expect(fn).toHaveBeenCalledTimes(1);
        });
    });

    describe('Value Registration', () => {
        it('duplicate name registration produces error', () => {
            let blue: IRegisterable = {
                builder: function blue() {},
                name: 'blue',
            };

            let orange: IRegisterable = {
                builder: function blue() { return 5; },
                name: 'blue',
            };
    
            testable.register(blue);
            expect(() => { testable.register(orange); }).toThrow('Registration failed: Module \'blue\' is already registered.');
        });
    
        it('named value registration works correctly', () => {
            const expected = {
                name: 'expectedThing',
                getValue: () => 44,
            }
    
            testable.registerValue(expected);
    
            let result = testable.build('expectedThing');
    
            expect(result).toBe(expected);
        });
    
        it('unnamed value registration produces error', () => {
            const value = { word: 'hello' };
    
            expect(() => { testable.registerValue(value); }).toThrow('Registration failed: Module name must be provided either as a property or parameter.');
        });
    
        it('parameter-named value registration works correctly', () => {
            const expected = 44;
    
            testable.registerValue(expected, 'fortyFour');
    
            let result = testable.buildAs<number>('fortyFour');
    
            expect(result).toBe(expected);
        });

        it('parameter name overrides object name property', () => {
            const expected = {
                name: 'expectedThing',
                getValue: () => 44,
            }
    
            testable.registerValue(expected, 'dog');
    
            let result = testable.build('dog');
    
            expect(result).toBe(expected);
            expect(() => {testable.build('expectedThing'); }).toThrow('Build failed: No module named \'expectedThing\' is registered.');
        });
    });

    describe('Builder Registration', () => {
        it('registered builder execution works correctly', () => {
            let fn = jest.fn();
            function neon(...args: any[]){ fn(...args);  return 'blue'; }

            testable.registerBuilder(neon, []);

            let result = testable.build('neon');

            expect(fn).toHaveBeenCalledWith();
            expect(result).toBe('blue');
        });

        it('unnamed builder registration produces error', () => {
            expect(() => { testable.registerBuilder(() => 'black', []); }).toThrow('Registration failed: Function name is required either on the function or as a parameter.');
        });

        it('parameter-named builder registration works correctly', () => {
            let fn = jest.fn();
            function neon(...args: any[]){ fn(...args);  return 65; }

            testable.registerBuilder(neon, [], 'dog');

            let result = testable.build('dog');

            expect(fn).toHaveBeenCalledWith();
            expect(result).toBe(65);
            expect(() => { testable.build('neon'); }).toThrow('Build failed: No module named \'neon\' is registered.');
        });

        it('builder dependency resolution works correctly', () => {
            let redValue = {
                red: true
            }
            let redFn = jest.fn();
            function red(...args: any[]) { redFn(...args); return redValue; }

            let blueValue = { color: 0x0000FF };
            let blueFn = jest.fn();
            function blue(...args: any[]) { blueFn(...args); return blueValue; }

            let greenValue = { right: 'left', up: 'down' };
            let greenFn = jest.fn();
            function green(...args: any[]) { greenFn(...args); return greenValue; }

            const hueValue = { place: [51.470020, -0.454295] };
            let hueFn = jest.fn();
            let hue: IRegisterable = {
                builder: function hue(...args: any[]) { hueFn(...args); return hueValue; },
                name: 'hue',
            };

            testable.
                registerBuilder(red, []).
                register(hue).
                registerBuilder(blue, ['red', 'hue']).
                registerBuilder(green, ['blue']);

            let result = testable.build('green');

            expect(redFn).toHaveBeenCalledWith();
            expect(hueFn).toHaveBeenCalledWith();
            expect(blueFn).toHaveBeenCalledWith(redValue, hueValue);
            expect(greenFn).toHaveBeenCalledWith(blueValue);

            expect(result).toBe(greenValue);
        });

        it('singleton builder executes only once', () => {
            let fn = jest.fn();
            function borg() { fn(); return {}; }

            testable.registerBuilder(borg, [], undefined, true);

            const cnt = getRandomNumber();
            for (let index = 0; index < cnt; index++) {
                testable.build('borg');
            }

            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('non-singleton builder executes multiple times', () => {
            let fn = jest.fn();
            function borg() { fn(); return {}; }

            testable.registerBuilder(borg, []);

            const cnt = getRandomNumber();
            for (let index = 0; index < cnt; index++) {
                testable.build('borg');
            }

            expect(fn).toHaveBeenCalledTimes(cnt);
        });
    });

    describe('Replacement Functionality', () => {
        it('non-testable container rejects replacement', () => {
            expect(environment.supportsReplace()).toBe(false);
        });
    
        it('testable container supports replacement', () => {
            expect(testable.supportsReplace()).toBe(true);
        });

        it('non-testable module replacement produces error', () => {
            // TODO: need a real module to test this.
        });

        it('testable module replacement works correctly', () => {
            let fn = jest.fn();
            let registerable: IRegisterable = {
                builder: function getNumberTest() { fn(); return 'no number' },
                name: 'getNumberTest',
            };

            testable.registerValue(45, 'getNumberTest');

            testable.replace(registerable);
            let result = testable.build('getNumberTest');

            expect(fn).toHaveBeenCalled();
            expect(result).toBe('no number');
        });

        it('unregistered module replacement produces error', () => {
            let registerable: IRegisterable = {
                builder: function getNumberTest() { },
                name: 'getNumberTest',
            };

            expect(() => { testable.replace(registerable); }).toThrow('Replacement failed: Module \'getNumberTest\' is not registered.');
        });

        it('double replacement attempt produces error', () => {
            let registerable: IRegisterable = {
                builder: function replaced() { },
                name: 'replaced',
            };

            let aRegisterable: IRegisterable = {
                builder: function replaced() { },
                name: 'replaced',
            };

            let bRegisterable: IRegisterable = {
                builder: function replaced() { },
                name: 'replaced',
            };

            testable.register(registerable);
            testable.replace(aRegisterable);

            expect(() => testable.replace(bRegisterable)).toThrow('Replacement failed: Module \'replaced\' is not registered.');
        });

        it('non-singleton to singleton replacement works correctly', () => {
            let original: IRegisterable = {
                builder: function original() {},
                name: 'original',
            };

            let fn = jest.fn();
            let replacement: IRegisterable = {
                builder: function original() { fn(); return []; },
                name: 'original',
                singleton: true,
            };

            testable.register(original);
            testable.replace(replacement);

            const cnt = getRandomNumber();
            for (let index = 0; index < cnt; index++) {
                testable.build('original');
            }

            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('singleton to non-singleton replacement works correctly', () => {
            let origValue = { some: 'original' };
            let registerable: IRegisterable = {
                builder: function blah() { return origValue; },
                name: 'blah',
                singleton: true,
            };

            let repFn = jest.fn();
            let repValue = { its: 'a fake' };
            let rep: IRegisterable = {
                builder: function blah() { repFn(); return repValue; },
                name: 'blah',
            };

            testable.register(registerable);
            testable.build(registerable.name);

            testable.replace(rep);

            const cnt = getRandomNumber();
            for (let index = 0; index < cnt; index++) {
                testable.build(registerable.name);
            }

            expect(repFn).toHaveBeenCalledTimes(cnt);
        });
    });

    describe('Restore Method', () => {
        it('restored original method calls correctly', () => {
            const origValue = { original: true };
            let fnOrig = jest.fn();
            let registerable: IRegisterable = {
                builder: function toDo() { fnOrig(); return origValue; },
                name: 'toDo',
            };


            let repFn = jest.fn();
            const repValue = { original: false };
            let rep: IRegisterable = {
                builder: function toDo() { repFn(); return repValue; },
                name: 'toDo',
            };

            testable.register(registerable);
            testable.replace(rep);
            testable.restore(registerable.name);

            let result = testable.build(registerable.name);

            expect(fnOrig).toHaveBeenCalled();
            expect(repFn).not.toHaveBeenCalled();
            expect(result).toBe(origValue);
        });

        it('singleton restoration preserves cached value', () => {
            const origValue = { original: true };
            let registerable: IRegisterable = {
                builder: function toDo() { return origValue; },
                name: 'toDo',
                singleton: true,
            };
            
            const repValue = { original: false };
            let rep: IRegisterable = {
                builder: function toDo() { return repValue; },
                name: 'toDo',
                singleton: true,
            };

            testable.register(registerable);
            testable.build(registerable.name);

            testable.replace(rep);
            let fake = testable.build(registerable.name);

            testable.restore(registerable.name);
            let result = testable.build(registerable.name);

            expect(result).toBe(origValue);
            expect(fake).toBe(repValue);
        });
    });

    describe('Replace Builder Method', () => {
        it('builder function replacement works correctly', () => {
            let origFn = jest.fn();
            let registerable: IRegisterable = {
                builder: function bang() { origFn(); },
                name: 'bang',
            };

            let fakeFn = jest.fn();
            function bang() { fakeFn(); }

            testable.register(registerable);
            testable.replaceBuilder(bang, []);

            testable.build('bang');

            expect(origFn).not.toHaveBeenCalled();
            expect(fakeFn).toHaveBeenCalled();
        });

        it('anonymous function without name parameter produces error', () => {
            let registerable: IRegisterable = {
                builder: function bang() { },
                name: 'bang',
            }

            testable.register(registerable);

            expect(() => { testable.replaceBuilder(() => {}, []); }).toThrow('Replacement failed: Builder name is required either on the function or as a parameter.');
        });

        it('anonymous function with name parameter works correctly', () => {
            let origFn = jest.fn();
            let registerable: IRegisterable = {
                builder: () => { origFn(); },
                name: 'bang',
            };

            let fakeFn = jest.fn();

            testable.register(registerable);
            testable.replaceBuilder(() => { fakeFn(); }, [], 'bang');

            testable.build('bang');
            
            expect(origFn).not.toHaveBeenCalled();
            expect(fakeFn).toHaveBeenCalled();
        });

        it('replacement builder dependencies resolve correctly', () => {
            testable.registerBuilder(() => {}, [], 'cyan');
            let fnPurple = jest.fn()
            testable.registerBuilder(() => { fnPurple(); }, [], 'purple');
            
            testable.replaceBuilder(() => { }, ['purple'], 'cyan');

            testable.build('cyan');

            expect(fnPurple).toHaveBeenCalled();
        });

        it('non-singleton to singleton builder replacement works correctly', () => {
            let origFn = jest.fn();
            testable.registerBuilder(() => { origFn(); return {}; }, [], 'teal');


            let fakeFn = jest.fn();
            testable.replaceBuilder(() => { fakeFn(); return {}; }, [], 'teal', true);

            const cnt = getRandomNumber();
            for (let index = 0; index < cnt; index++) {
                testable.build('teal');
            }

            expect(fakeFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('Replace Value Method', () => {
        it('value replacement works correctly', () => {
            let origFn = jest.fn();
            testable.registerBuilder(() => { origFn() ;return { original: false }; }, [], 'red');
            let expected = { original: false, name: 'red'};
            testable.replaceValue(expected);

            let result = testable.build('red');

            expect(origFn).not.toHaveBeenCalled();
            expect(result).toBe(expected);
        });

        it('unnamed value replacement produces error', () => {
            testable.registerBuilder(() => {}, [], 'grey');

            expect(() => testable.replaceValue({ orange: 'jam' })).toThrow('Replacement failed: Value name must be provided either as a property or parameter.');
        });

        it('parameter-named value replacement works correctly', () => {
            testable.registerBuilder(() => { return { isGrey: true } }, [], 'grey');
            const expected = { isGrey: false };
            testable.replaceValue(expected, 'grey');

            let result = testable.build('grey');

            expect(result).toBe(expected);
        });
    });

    describe('Replace Package Builder Method', () => {
        it('node package replacement works correctly', () => {
            const fakeFs = { is: 'not fs' };
            function fs () { return fakeFs; }
            testable.replacePackageBuilder(fs);

            let result = testable.build('fs');

            expect(result).toBe(fakeFs);
        });

        it('unnamed package builder replacement produces error', () => {
            expect(() => testable.replacePackageBuilder(() => { return {}; })).toThrow('Replacement failed: Package builder name is required either on the function or as a parameter.');
        });

        it('named package builder replacement works correctly', () => {
            const fakePath = { isNot: 'a path' };
            testable.replacePackageBuilder(() => { return fakePath; }, 'path');
        });

        it('package singleton replacement works correctly', () => {
            const fakeBuffer = { iAm: 'not a buffer' };
            let fakeFn = jest.fn();
            testable.replacePackageBuilder(() => { fakeFn(); return fakeBuffer; }, 'buffer', true);

            const cnt = getRandomNumber();
            for (let index = 0; index < cnt; index++) {
                testable.build('buffer');
            }

            expect(fakeFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('has replacePackageValue method that', () => {
        it('should replace a package with a value.', () => {
            const expected = { real: 'you kidding me', name: 'child_process' };
            testable.replacePackageValue(expected);

            let result = testable.build('child_process');

            expect(result).toBe(expected);
        });

        it('should not replace a package with value that does not have a name if no name is provided as a parameter.', () => {
            expect(() => testable.replacePackageValue({ bad: true })).toThrow('Replacement failed: Package value name must be provided either as a property or parameter.');
        });

        it('should allow for a value without a name property if the name is passed as a parameter.', () => {
            const fakeCrypto = { secure: 'Nope!' };
            testable.replacePackageValue(fakeCrypto, 'crypto');

            let result = testable.build('crypto');

            expect(result).toBe(fakeCrypto);
        });
    });
});