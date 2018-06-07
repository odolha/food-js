import { FoodJs, foodjs, FoodJSMaker } from "@food-js/core/foodjs";
import { Attribute, Qualifier, Relation, Thing } from "@food-js/core";
import { Concept } from "@food-js/core/concept";
import { by, summarized, tagged } from "@food-js/lib-commons/core.concepts";

export const coreDslUnit = foodjs.unit('@lib-food-js/lib-core-dsl');
const { plugin } = coreDslUnit.make;

type ItemDefinitionInfo<T extends Concept> = Qualifier<T> | Subject<T> | Array<Qualifier<T>>;

class Subject<T extends Concept> {
  private target: Thing;
  private enhancements: { attribute: Attribute, additionalInfo: ItemDefinitionInfo<any> }[] = [];

  constructor(target: Thing) {
    this.target = target;
  }

  where<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): Subject<T> {
    this.enhancements.push({ attribute, additionalInfo });
    return this;
  }

  with<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): Subject<T> {
    return this.where(attribute, additionalInfo);
  }

  being<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): Subject<T> {
    return this.where(attribute, additionalInfo);
  }

  resolve(queue: Thing[] = []): Thing {
    return this.enhancements.reduce((res: Thing, { attribute, additionalInfo }) => {
      if (additionalInfo) {
        if (additionalInfo instanceof Qualifier) {
          return res.withAttribute(attribute.withQualifier(additionalInfo));
        } else if (additionalInfo instanceof Subject) {
          return res.withAttribute(attribute.withQualifier(additionalInfo.resolve()));
        } else {
          return (additionalInfo as any[]).reduce((thing, q) => thing.withAttribute(attribute.withQualifier(q)), res)
        }
      } else {
        return res.withAttribute(attribute);
      }
    }, this.target);
  }
}

type CaptureInfo<T extends Concept> = Qualifier<T> | Subject<T>;
type CaptureTarget = { subject: Subject<Thing>, adjustments: { attribute: Attribute, additionalInfo: CaptureInfo<any> }[] };
type CaptureApplication = { relation: Relation, attributes: Attribute[] };

class Capture {
  private targets: CaptureTarget[] = [];
  private application: CaptureApplication;
  private result: Subject<Thing> | Thing;
  private next: Capture;

  constructor(subject: Subject<Thing>) {
    this.taking(subject);
  }

  private get lastTarget(): CaptureTarget {
    return this.targets[this.targets.length - 1];
  }

  taking(subject: Subject<Thing>): this {
    this.targets.push({ subject, adjustments: [] });
    return this;
  }

  adjust<T extends Concept>(attribute: Attribute, additionalInfo: CaptureInfo<T> = Qualifier.plain): this {
    this.lastTarget.adjustments.push({ attribute, additionalInfo });
    return this;
  }

  perform(relation: Relation): this {
    this.application = { relation, attributes: [] };
    return this;
  }

  for(attribute: Attribute): this {
    this.application.attributes = [ ...this.application.attributes, attribute ];
    return this;
  }

  by(qualifiers: Qualifier<any>[]): this {
    this.application.attributes = [ ...this.application.attributes, ...(qualifiers.map(q => by.withQualifier(q))) ];
    return this;
  }

  toObtain(result: Subject<Thing>): this {
    this.result = result;
    return this;
  }

  then(next: Capture): this {
    // allow flat usage of then to create link
    if (this.next) {
      this.next.then(next);
    } else {
      this.next = next;
    }
    return this;
  }

  private resolveTarget(target: CaptureTarget, queue: Thing[] = []): Thing {
    const initial = target.subject.resolve(queue);
    return target.adjustments.reduce((res, { attribute, additionalInfo }) => {
      if (additionalInfo) {
        if (additionalInfo instanceof Qualifier) {
          return res.withAttribute(attribute.withQualifier(additionalInfo));
        } else {
          return res.withAttribute(attribute.withQualifier(additionalInfo.resolve(queue)));
        }
      } else {
        return res.withAttribute(attribute);
      }
    }, initial);
  }

  resolve(queue: Thing[] = [], make: FoodJSMaker): Relation {
    const resolvedTargets = this.targets.map(target => this.resolveTarget(target, queue));
    const resolvedApplication = this.application.attributes.reduce((rel, attr) => rel.withAttribute(attr), this.application.relation);
    const resolvedResult = this.result instanceof Thing ? this.result : this.result.resolve();
    const resolvedRelation = resolvedApplication.withInput(make.group(...resolvedTargets)).withOutput(resolvedResult);
    if (this.next) {
      return this.next.resolve(queue, make).withMergedInput(resolvedRelation);
    } else {
      return resolvedRelation;
    }
  }

}

interface DefContextUtils {
  requires(requirements: Subject<Thing>[]): void;
  some<T extends Concept>(target: Thing): Subject<T>;
  a<T extends Concept>(target: Thing): Subject<T>;
  summary(capture: Capture): void;
  taking(subject: Subject<Thing>): Capture;
  the(thing: Thing): Subject<Thing>;
}

export class DefContext implements DefContextUtils{
  private requirements: Subject<Thing>[] = [];
  private summaryCapture: Capture;

  constructor(private make: FoodJSMaker) { }

  requires(requirements: Subject<Thing>[]): void {
    this.requirements = [ ...this.requirements, ...requirements ];
  }

  some<T extends Concept>(target: Thing): Subject<T> {
    return new Subject<T>(target);
  }

  a<T extends Concept>(target: Thing): Subject<T> {
    return this.some(target);
  }

  summary(capture: Capture): void {
    this.summaryCapture = capture;
  }

  taking(subject: Subject<Thing>): Capture {
    return new Capture(subject);
  }

  the(thing: Thing): Subject<Thing> {
    return new Subject<Thing>(thing);
  }

  resolveRequirements(): Thing[] {
    return this.requirements.map(req => req.resolve());
  }

  buildSummary(reqs: Thing[]): Relation {
    // TODO: verify end result to yield a relation
    return this.summaryCapture.resolve(reqs, this.make) as Relation;
  }

  buildMain(root: Capture, reqs: Thing[]): Relation {
    // TODO: verify end result to yield a relation
    return root.resolve(reqs, this.make) as Relation;
  }

  buildAll(rootCapture: Capture): { summary: Relation, main: Relation } {
    const resolvedRequirements = this.resolveRequirements();
    return {
      summary: this.summaryCapture ? this.buildSummary(resolvedRequirements) : null,
      main: this.buildMain(rootCapture, resolvedRequirements)
    };
  }

}

function makeContextUtils(context: DefContext): DefContextUtils {
  return {
    requires: context.requires.bind(context),
    some: context.some.bind(context),
    a: context.a.bind(context),
    summary: context.summary.bind(context),
    taking: context.taking.bind(context),
    the: context.the.bind(context)
  };
}

type DefBuilderFunction = (utils: DefContextUtils) => Capture;

class DefBuilder {
  make: FoodJSMaker;
  context: DefContext;

  constructor(private foodjs: FoodJs, private tag: string, private fn: DefBuilderFunction) {
    this.make = foodjs.make;
    this.context = new DefContext(this.make);
  }

  build(): Relation {
    const rootCapture = this.fn(makeContextUtils(this.context));
    const { summary, main } = this.context.buildAll(rootCapture);
    const summaryProduction = summary ? summary.withAttribute(summarized) : null;
    const mainProduction = main.withAttribute(tagged.withQualifier(this.make.value(this.tag)));
    return summaryProduction ? mainProduction.withSynonym(summaryProduction) : mainProduction;
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
