import { waitFor } from './awaitable';

class Example {
    reconnecting: boolean = false;
    async test() {
        console.log('waiting for flag change');
        await waitFor(this, 'reconnecting');
        console.log('flag was changed!');
    }
}
async function main() {
    const e = new Example();
    e.test();
    setTimeout(() => {
        console.log('changing flag. was', e.reconnecting)
        e.reconnecting = true;
        console.log('became', e.reconnecting);
    }, 2000)
    console.log('main end')
}

main();