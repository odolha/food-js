import { FoodJs, foodjs, FoodJSMaker } from "@food-js/core/foodjs";
import { Attribute, Relation, Thing } from "@food-js/core";
import { Qualifier } from "@food-js/core/qualifier";
import { Concept } from "@food-js/core/concept";

export const coreDslUnit = foodjs.unit('@food-js/core-dsl');
const { plugin } = coreDslUnit.make;

type QualifierDef<T extends Concept> = Qualifier<T> | QualifierDefArray<T>;
interface QualifierDefArray<T extends Concept> extends Array<QualifierDef<T>> { }

function resolveQualifier<T extends Concept>(def: QualifierDef<T>): Qualifier<T> {
  if (def instanceof Qualifier) {
    return def;
  } else {
    // XXX not ok, simplify
    const [subTarget, ...nextQualifiers] = def;
    if (subTarget instanceof Attribute) {
      return subTarget.withQualifier(resolveQualifier(nextQualifiers));
    } else if (subTarget instanceof Concept) {
      return subTarget.withAttribute(resolveQualifier(nextQualifiers) as Attribute);
    }
  }
}

type Subject = Thing | Capture<Thing>;

class Capture<T extends Concept> {
  constructor(private target: Thing, private qualifiers: QualifierDef<T>) { }
}

abstract class ProductionSpec {
  abstract buildProduction(bareProduction?: Relation, pool?: Subject[]): Relation;
}

class SubjectProductionSpec extends ProductionSpec {
  private application: Relation;
  private result: Thing;
  private adjustment: Attribute;

  constructor(private subject: Subject) {
    super();
  }

  adjust<T extends Concept>(attribute: Attribute, qualifiers: QualifierDef<T>): SubjectProductionSpec {
    this.adjustment = attribute.withQualifier(resolveQualifier(qualifiers));
    return this;
  }

  apply(application: Relation): SubjectProductionSpec {
    this.application = application;
    return this;
  }

  yields(result: Thing): SubjectProductionSpec {
    this.result = result;
    return this;
  }

  buildProduction(bareProduction?: Relation, pool?: Subject[]): Relation {
    // XXX
    return bareProduction;
  }
}

class AttributeProductionSpec extends ProductionSpec {
  constructor(private attribute: Attribute) {
    super();
  }

  buildProduction(bareProduction?: Relation, pool?: Subject[]): Relation {
    // XXX
    return bareProduction;
  }
}

class SeqProductionSpec extends ProductionSpec {
  constructor(private specs: ProductionSpec[]) {
    super();
  }

  buildProduction(bareProduction?: Relation, pool?: Subject[]): Relation {
    // XXX
    return bareProduction;
  }
}

class ParProductionSpec extends ProductionSpec {
  constructor(private specs: ProductionSpec[]) {
    super();
  }

  buildProduction(bareProduction?: Relation, pool?: Subject[]): Relation {
    // XXX
    return bareProduction;
  }
}

export class DefContext {
  private requirements: Subject[];
  private summarySpec: ProductionSpec;

  constructor(private make: FoodJSMaker) { }

  requires(requirements: Subject[]): void {
    this.requirements = [ ...this.requirements, ...requirements ];
  }

  some<T extends Concept>(target: Thing, qualifiers: QualifierDef<T>): Capture<T> {
    return new Capture<T>(target, qualifiers);
  }

  summary(spec: ProductionSpec): void {
    this.summarySpec = spec;
  }

  taking(subject: Subject): SubjectProductionSpec {
    return new SubjectProductionSpec(subject);
  }

  sequence(...specs: ProductionSpec[]): SeqProductionSpec{
    return new SeqProductionSpec(specs);
  }

  parallel(...specs: ProductionSpec[]): ParProductionSpec {
    return new ParProductionSpec(specs);
  }

  wait(time: Attribute): AttributeProductionSpec {
    return new AttributeProductionSpec(time);
  }

  buildUpon(bareProduction: Relation, spec: ProductionSpec): Relation {
    return spec.buildProduction(bareProduction, this.requirements).withSynonym(this.summarySpec.buildProduction());
  }
}

type DefBuilderFunction = (utils: DefContext) => ProductionSpec;

class DefBuilder {
  make: FoodJSMaker;
  context: DefContext;

  constructor(private foodjs: FoodJs, private code: string, private fn: DefBuilderFunction) {
    this.make = foodjs.make;
    this.context = new DefContext(this.make);
  }

  build(): Relation {
    const bareProduction = this.make.production(this.code); // starting point
    const spec = this.fn(this.context); // defines how the production will build
    return this.context.buildUpon(bareProduction, spec);
  }
}

class DefBuilderPartial {
  constructor(public foodjs: FoodJs, public code: string) { }
  as(fn: DefBuilderFunction): DefBuilder {
    return new DefBuilder(this.foodjs, this.code, fn);
  }
}

declare module '@food-js/core/foodjs' {
  interface FoodJs {
    define(code: string): DefBuilderPartial;
  }
}

export const define = plugin('define', {
  globalExtensions: [
    {
      type: FoodJs,
      method: 'define',
      implementation: (self: any, productionCode: string) => new DefBuilderPartial(self, productionCode)
    }
  ]});
