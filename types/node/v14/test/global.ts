import { Readable, Writable } from 'node:stream';

{
    const x: NodeModule = {} as any;
    const y: NodeModule = {} as any;
    x.children.push(y);
    x.parent = require.main!;
    require.main = y;
    x.path; // $ExpectType string
}

{
    // const a = new TextEncoder();
}

{
    queueMicrotask(() => {
        // cool
    });
}

{
    const a = new Readable();
    a.unshift('something', 'utf8');
}

{
    const a = Readable.from(['test'], {
        objectMode: true,
    });
}

const a: NodeJS.TypedArray = new Buffer(123);

{
    let writableFinished: boolean;
    const readable: Readable = new Readable({
        read() {
            this.push('hello');
            this.push('world');
            this.push(null);
        },
    });
    readable.destroyed;
    const writable: Writable = new Writable({
        write(chunk, _, cb) {
            cb();
        },
    });
    readable.pipe(writable);
    writableFinished = writable.writableFinished;
    writable.destroyed;
}

{
  const obj = {
    valueOf() {
      return 'hello';
    }
  };
  Buffer.from(obj);
}

const buff = Buffer.from("Hello World!");

// reads

buff.readInt8();
buff.readInt8(0);
buff.readUInt8();
buff.readUInt8(0);
buff.readUInt16BE();
buff.readUInt16BE(0);
buff.readUInt32LE();
buff.readUInt32LE(0);
buff.readUInt32BE();
buff.readUInt32BE(0);
buff.readInt8();
buff.readInt8(0);
buff.readInt16LE();
buff.readInt16LE(0);
buff.readInt16BE();
buff.readInt16BE(0);
buff.readInt32LE();
buff.readInt32LE(0);
buff.readInt32BE();
buff.readInt32BE(0);
buff.readFloatLE();
buff.readFloatLE(0);
buff.readFloatBE();
buff.readFloatBE(0);
buff.readDoubleLE();
buff.readDoubleBE(0);

// writes

buff.writeInt8(0xab);
buff.writeInt8(0xab, 0);
buff.writeUInt8(0xab);
buff.writeUInt8(0xab, 0);
buff.writeUInt16LE(0xabcd);
buff.writeUInt16LE(0xabcd, 0);
buff.writeUInt16BE(0xabcd);
buff.writeUInt16BE(0xabcd, 0);
buff.writeUInt32LE(0xabcd);
buff.writeUInt32LE(0xabcd, 0);
buff.writeUInt32BE(0xabcd);
buff.writeUInt32BE(0xabcd, 0);
buff.writeInt16LE(0xabcd);
buff.writeInt16LE(0xabcd, 0);
buff.writeInt16BE(0xabcd);
buff.writeInt16BE(0xabcd, 0);
buff.writeInt32LE(0xabcd);
buff.writeInt32LE(0xabcd, 0);
buff.writeInt32BE(0xabcd);
buff.writeInt32BE(0xabcd, 0);
buff.writeFloatLE(0xabcd);
buff.writeFloatLE(0xabcd, 0);
buff.writeFloatBE(0xabcd);
buff.writeFloatBE(0xabcd, 0);
buff.writeDoubleLE(123.123);
buff.writeDoubleLE(123.123, 0);
buff.writeDoubleBE(123.123);
buff.writeDoubleBE(123.123, 0);

// WebAssembly
// most examples pulled from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly with minor modifications
{
    const memory = new WebAssembly.Memory({ initial: 10, maximum: 100, shared: true });
    memory.grow(50); // $ExpectType number
    memory.buffer; // $ExpectType ArrayBuffer

    new WebAssembly.RuntimeError('hello');
    new WebAssembly.CompileError('world');
    new WebAssembly.LinkError('hello world');

    const global = new WebAssembly.Global({ value: 'i32', mutable: true }, 0);
    global.value = 50;
    global.valueOf(); // $ExpectType any

    const tbl = new WebAssembly.Table({ initial: 2, element: 'anyfunc' });
    tbl.length; // $ExpectType number
    tbl.get(0); // $ExpectType any
    tbl.grow(20); // $ExpectType number
    tbl.set(0, tbl.get(1));

    const importObject: WebAssembly.Imports = {
        imports: {
            imported_func: (arg: any) => {},
        },
    };
    const bytes = new ArrayBuffer(100);
    WebAssembly.validate(bytes); // $ExpectType boolean
    const mod = new WebAssembly.Module(bytes);
    const instance = new WebAssembly.Instance(mod, importObject);
    if ('exported_func' in instance.exports && instance.exports.exported_func instanceof Function) {
        instance.exports.exported_func();
    }

    WebAssembly.instantiate(mod, importObject).then((value: WebAssembly.Instance) => {});
    WebAssembly.instantiate(bytes, importObject).then((value: WebAssembly.WebAssemblyInstantiatedSource) => {
        const inst: WebAssembly.Instance = value.instance;
        const mod: WebAssembly.Module = value.module;
    });

    WebAssembly.compile(bytes).then((value: WebAssembly.Module) => {});

    const [exportDescriptor] = WebAssembly.Module.exports(mod);
    exportDescriptor.name; // $ExpectType string
    exportDescriptor.kind; // $ExpectType ImportExportKind
    const [importDescriptor] = WebAssembly.Module.imports(mod);
    importDescriptor.name; // $ExpectType string
    importDescriptor.kind; // $ExpectType ImportExportKind
    WebAssembly.Module.customSections(mod, 'hello world'); // $ExpectType ArrayBuffer[]
}
