import { property } from '../src';

class Manager {

    connected: boolean = false;

    async connect() {
        // ...
        setTimeout(() => {
            console.log('connected');
            this.connected = true;
        }, 1000);
    }

    async upload() {
        await property(this, 'connected').to((v) => {
            console.log('check');
            return false;
        });
        console.log('upload');
        // ...
    }

}

const manager = new Manager();
manager.upload();
manager.connect();
manager.connect();
manager.connect();
manager.connect();
manager.connect();
manager.upload();

// output:
// 1. connected
// 2. upload
