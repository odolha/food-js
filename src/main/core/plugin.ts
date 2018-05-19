export type PluginDefinition = Function[];

export class Plugin {
  constructor(private name: string, private def: PluginDefinition) { }
  load() {
    console.log(`Loading plugin: ${this.name}`);
    this.def.forEach(fn => fn());
  }
}
