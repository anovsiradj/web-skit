/**
 * Lakra.js
 * 
 * simple reactive library
 * 
 * lakra adalah istilah bahasa sansekerta,
 * yang artinya adalah dasar dalam bahasa indonesia.
 * 
 * yang bertujuannya untuk mengimplementasikan paradigma deklaratif,
 * tanpa menggunakan metode mainstream build dan kembali ke sifat alami js yaitu browser.
 * 
 * spesifikasi:
 * loop: [data-$each] + [data-$iden]
 * text: [data-$text]
 * html: [data-$html]
 * bind: [data-$bind]
 * event: [data-$attach] + [data-$handle]
 * 
 * @author anovsiradj
 * @version 20251220,20251111
 */

class Lakra {
    constructor(selector, initialState = {}, options = {}) {
        this.root = document.querySelector(selector);
        if (!this.root) {
            console.error(`Lakra: Elemen ${selector} tidak ditemukan`);
            return;
        }

        this.proxyMap = new WeakMap();
        this.effects = new Set();
        this.state = this.reactive(initialState);
        this.options = Object.assign({
            observeDom: true,
            compileShadowRoot: true,
        }, options);
        
        // Initial Compile
        this.compile(this.root);
        
        // Observe DOM for dynamic additions/attribute changes
        if (this.options.observeDom) {
            this.observeDom();
        }
    }

    reactive(obj) {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (obj._isLakraProxy) return obj;

        if (this.proxyMap.has(obj)) {
            return this.proxyMap.get(obj);
        }

        const self = this;

        const proxy = new Proxy(obj, {
            get(target, prop) {
                if (prop === '_isLakraProxy') return true;

                // Array method interception
                if (Array.isArray(target) && ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(prop)) {
                    return function(...args) {
                        const result = Array.prototype[prop].apply(target, args);
                        self.triggerEffects();
                        return result;
                    };
                }

                const value = target[prop];
                // Lazy wrap
                if (typeof value === 'object' && value !== null) {
                    return self.reactive(value);
                }
                return value;
            },
            set(target, prop, value) {
                target[prop] = value;
                self.triggerEffects();
                return true;
            }
        });

        this.proxyMap.set(obj, proxy);
        return proxy;
    }

    effect(fn) {
        this.effects.add(fn);
        fn(); // Run immediately
    }

    triggerEffects() {
        this.effects.forEach(fn => fn());
    }

    resolve(path, scope) {
        if (!path) return undefined;
        return path.split('.').reduce((o, k) => o?.[k], scope);
    }

    setValue(path, val, scope) {
        const parts = path.split('.');
        const last = parts.pop();
        const target = parts.reduce((o, k) => o?.[k], scope);
        if (target && target[last] !== val) {
            target[last] = val;
            // triggerEffects is handled by the Proxy setter
        }
    }

    compile(el, scope = null) {
        if (!el || el._lakra_compiled) return;
        console.log('Compiling', el.tagName);
        const currentScope = scope || this.state;

        // Loop: [data-$each] + [data-$iden]
        if (el.hasAttribute && el.hasAttribute('data-$each')) {
            this.handleLoop(el, currentScope);
            return; // Stop processing children of loop template, handled by handleLoop
        }

        // Text: [data-$text]
        if (el.hasAttribute && el.hasAttribute('data-$text')) {
            const prop = el.getAttribute('data-$text');
            this.effect(() => {
                const val = this.resolve(prop, currentScope);
                el.textContent = val !== undefined ? val : '';
            });
        }

        // HTML: [data-$html]
        if (el.hasAttribute && el.hasAttribute('data-$html')) {
            const prop = el.getAttribute('data-$html');
            this.effect(() => {
                const val = this.resolve(prop, currentScope);
                el.innerHTML = val !== undefined ? val : '';
            });
        }

        // Bind: [data-$bind]
        if (el.hasAttribute && el.hasAttribute('data-$bind')) {
            const prop = el.getAttribute('data-$bind');
            const isCheckable = el.type === 'checkbox' || el.type === 'radio';
            const eventName = isCheckable ? 'change' : 'input';
            const valueProp = isCheckable ? 'checked' : 'value';

            // Model -> View
            this.effect(() => {
                const val = this.resolve(prop, currentScope);
                if (el[valueProp] != val) {
                    el[valueProp] = val !== undefined ? val : '';
                }
            });

            // View -> Model
            if (!el._lakra_bound) {
                el.addEventListener(eventName, (e) => {
                    const val = el[valueProp];
                    this.setValue(prop, val, currentScope);
                });
                el._lakra_bound = true;
            }
        }

        // Event: [data-$attach] + [data-$handle]
        if (el.hasAttribute && el.hasAttribute('data-$attach')) {
            const eventType = el.getAttribute('data-$attach');
            const handlerName = el.getAttribute('data-$handle');
            
            if (!el._lakra_event_bound) {
                 el.addEventListener(eventType, (e) => {
                    // Try to find handler in scope or state
                    let handler = this.resolve(handlerName, currentScope);
                    if (!handler && currentScope !== this.state) {
                         handler = this.resolve(handlerName, this.state);
                    }
                    
                    if (typeof handler === 'function') {
                        handler.call(this.state, currentScope, e);
                    } else {
                        console.warn(`Lakra: Handler '${handlerName}' not found`);
                    }
                });
                el._lakra_event_bound = true;
            }
        }

        // Recurse children
        // Use Array.from to handle live collection issues if we were modifying structure, 
        // but here we just compile attributes.
        // Note: loop templates are removed, so we don't recurse into them here.
        if (el.children) {
            Array.from(el.children).forEach(child => this.compile(child, scope));
        }
        
        // Compile inside Shadow DOM (if present)
        if (this.options.compileShadowRoot && el.shadowRoot) {
            Array.from(el.shadowRoot.children).forEach(child => this.compile(child, scope));
        }
        
        el._lakra_compiled = true;
    }

    handleLoop(el, scope) {
        console.log('Handling loop for', el.tagName);
        const listPath = el.getAttribute('data-$each');
        const itemKey = el.getAttribute('data-$iden') || 'item';
        const parent = el.parentNode;
        
        // Placeholder
        const anchor = document.createTextNode('');
        parent.insertBefore(anchor, el);
        
        // Remove template
        el.remove();
        el.removeAttribute('data-$each'); // Cleanup attribute for clones
        
        let renderedNodes = [];

        this.effect(() => {
            console.log('Loop effect running');
            const list = this.resolve(listPath, scope);
            
            // Clear current
            renderedNodes.forEach(n => n.remove());
            renderedNodes = [];

            if (Array.isArray(list)) {
                list.forEach((item, index) => {
                    const clone = el.cloneNode(true);
                    
                    // Create child scope
                    // We use Object.create to inherit from parent
                    const itemScope = Object.create(scope);
                    Object.defineProperty(itemScope, itemKey, {
                        value: item,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(itemScope, '$index', {
                        value: index,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });

                    // We must manually add itemKey to the object so `resolve` finds it 
                    // (since resolve uses split/reduce which works on properties)
                    // Object.create works with dot access.
                    
                    // Compile clone
                    this.compile(clone, itemScope);
                    clone._lakra_compiled = true;
                    
                    // Insert
                    parent.insertBefore(clone, anchor);
                    renderedNodes.push(clone);
                });
            }
        });
    }
    
    observeDom() {
        const isLakraDirectiveAttr = (name) => ['data-$each','data-$iden','data-$text','data-$html','data-$bind','data-$attach','data-$handle'].includes(name);
        const shouldCompile = (el) => {
            if (!el || el._lakra_compiled || el.nodeType !== 1) return false; // ELEMENT_NODE
            // Quick check: has any Lakra directive attribute
            return Array.from(el.attributes || []).some(a => isLakraDirectiveAttr(a.name));
        };
        
        const compileTree = (node, scope = null) => {
            if (node.nodeType !== 1) return; // ELEMENT_NODE
            if (shouldCompile(node)) this.compile(node, scope);
            // traverse children
            Array.from(node.children || []).forEach(child => compileTree(child, scope));
            // traverse shadow root if enabled
            if (this.options.compileShadowRoot && node.shadowRoot) {
                Array.from(node.shadowRoot.children || []).forEach(child => compileTree(child, scope));
            }
        };
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes && m.addedNodes.forEach(n => compileTree(n));
                if (m.type === 'attributes' && isLakraDirectiveAttr(m.attributeName)) {
                    compileTree(m.target);
                }
            });
        });
        
        observer.observe(this.root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-$each','data-$iden','data-$text','data-$html','data-$bind','data-$attach','data-$handle'],
        });
        
        this._domObserver = observer;
    }
}

// Make it global
globalThis.Lakra = Lakra;

// Example usage commented out
/*
const state = new Lakra('#app', {
    users: [{ name: 'A' }, { name: 'B' }],
    add() { this.users.push({ name: 'New' }) }
});
*/
