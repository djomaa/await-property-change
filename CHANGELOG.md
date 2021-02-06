## planes for 0.0.3
* ability to pass function like `(newValue: T[K]) => boolean` to conditional resolve promise
* testing

## 0.0.2
* full refactoring
* new ability to pass the value: promise will resolve when `target.property` becomes equal to this value
    * if you want to handle any changes: does not provide anything
* prefomance improvment: for every passed value only one promise will be created
    * if promise for the passed value exists, it will be returned
* add support for following types of property descriptors:
```
class NewSupport {
    connected: boolean;
    set connected(v: any): any;
    // for not declared property (for js)
}
```

## 0.0.1
Basic implementation:
* new promise on every call
* resolving on property value change
* only writable properties supported
