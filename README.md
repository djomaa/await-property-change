# Awaitable-property (v0.0.1)
Sometimes it's needed to wait until instance property flag becomes true

## Installation
not implemented yet, sources only

## Usage
```typescript
import { waitFor } from 'LIB_NAME';


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

// output:
// 1. connected
// 2. upload
```
Also you can check`src/test.ts`.