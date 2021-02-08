import { waitFor } from '../dist';

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
        await waitFor(this, 'connected');
        console.log('upload');
        // ...
    }

}

const manager = new Manager();
manager.upload();
manager.connect();
manager.upload();

// output:
// 1. connected
// 2. upload
