//////////////////////////////////////////////////////////////////////////
/// `globalThis` Tests: https://node.green/#ES2020-features-globalThis ///
//////////////////////////////////////////////////////////////////////////

{
    const isGlobalThis: typeof globalThis = global;

    const accessibleToGlobalThisMembers: true = global.RANDOM_GLOBAL_VARIABLE;
}

declare var RANDOM_GLOBAL_VARIABLE: true;

// global aliases for compatibility
{
    const x: NodeModule = {} as any;
    const y: NodeModule = {} as any;
    x.children.push(y);
    x.parent = require.main!;
    require.main = y;
    x.path; // $ExpectType string
}

// exposed gc
{
    if (gc) {
        gc();
    }
}

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
