import { logger } from "@food-js/utils/logger";
import { doNothing } from "@food-js/utils/functions";

export interface GlobalExtensionMethod {
  type: any;
  method: string;
  implementation: (self: any, ...args: any[]) => any
}

export interface GlobalExtensionAttribute {
  type: any;
  attribute: string;
  value?: any;
  getter?: (self: any) => any;
  setter?: (self: any, value: any) => any;
}

export type GlobalExtension = GlobalExtensionMethod | GlobalExtensionAttribute;

export type PluginDefinition = {
  globalExtensions: GlobalExtension[];
}

export class Plugin {
  constructor(private name: string, private def: PluginDefinition) { }

  load() {
    logger.debug(`Loading plugin: ${this.name}`);
    this.def.globalExtensions.forEach(ext => {
      if (ext['method']) {
        const extMethod = ext as GlobalExtensionMethod;
        logger.debug(`Applying global extension for method: ${ext.type.name}.${extMethod.method}`);
        extMethod['_original'] = extMethod.type.prototype[extMethod.method];
        extMethod.type.prototype[extMethod.method] = function(...args) {
          return extMethod.implementation(this, ...args);
        };
      } else if (ext['attribute']) {
        const extAttr = ext as GlobalExtensionAttribute;
        logger.debug(`Applying global extension for attribute: ${extAttr.type.name}.${extAttr.attribute}`);
        extAttr['_original'] = extAttr.type.prototype[extAttr.attribute];
        if (extAttr.value !== undefined) {
          extAttr.type.prototype[extAttr.attribute] = extAttr.value;
        } else {
          Object.defineProperty(extAttr.type.prototype, extAttr.attribute, {
            enumerable: true,
            configurable: true,
            get: function(): any {
              return extAttr.getter ? extAttr.getter(this) : undefined;
            },
            set: function(value: any) {
              extAttr.setter ? extAttr.setter(this, value) : doNothing();
            }
          });
        }
      } else {
        throw new Error(`Cannot apply extension. Unsupported type, expecting either 'method' or 'attribute'.`);
      }
    });
  }

  unload() {
    logger.debug(`Un-loading plugin: ${this.name}`);
    this.def.globalExtensions.forEach(ext => {
      if (ext['method']) {
        const extMethod = ext as GlobalExtensionMethod;
        logger.debug(`Reverting global extension for method: ${extMethod.type.name}.${extMethod.method}`);
        extMethod.type.prototype[extMethod.method] = extMethod['_original'];
      } else if (ext['attribute']) {
        const extAttr = ext as GlobalExtensionAttribute;
        logger.debug(`Reverting global extension for attribute: ${extAttr.type.name}.${extAttr.attribute}`);
        extAttr.type.prototype[extAttr.attribute] = extAttr['_original'];
      } else {
        throw new Error(`Cannot unload extension. Unsupported type, expecting either 'method' or 'attribute'.`);
      }
    });
  }
}
