import { logger } from "@food-js/utils/logger";

export type PluginDefinition = {
  globalExtensions: { type: any, method: string, implementation: (self: any) => any }[];
}

export class Plugin {
  constructor(private name: string, private def: PluginDefinition) { }

  load() {
    logger.debug(`Loading plugin: ${this.name}`);
    this.def.globalExtensions.forEach(ext => {
      logger.debug(`Applying global extension: ${ext.type}.${ext.method}`);
      ext['_original'] = ext.type.prototype[ext.method];
      ext.type.prototype[ext.method] = function() {
        return ext.implementation(this);
      };
    });
  }

  unload() {
    logger.debug(`Un-loading plugin: ${this.name}`);
    this.def.globalExtensions.forEach(ext => {
      logger.debug(`Reverting global extension: ${ext.type}.${ext.method}`);
      ext.type.prototype[ext.method] = ext['_original'];
    });
  }
}
