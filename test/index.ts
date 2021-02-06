// import './example';

function test() {
    return {
        then() {
            console.log('then')
        },
        notEqual() {
            console.log('not equal');
        },
        falsy() {
            console.log('falsy');
        }
    }
}

async function main() {
    const a = test.a
}