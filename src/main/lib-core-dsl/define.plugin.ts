import { FoodJs, foodjs, FoodJSMaker } from "@food-js/core/foodjs";
import { Attribute, Qualifier, Relation, Thing } from "@food-js/core";
import { Concept } from "@food-js/core/concept";
import { by, summarized, tagged } from "@food-js/lib-commons/core.concepts";

export const coreDslUnit = foodjs.unit('@lib-food-js/lib-core-dsl');
const { plugin } = coreDslUnit.make;

type ItemDefinitionInfo<T extends Concept> = Qualifier<T> | Subject<T> | Array<Qualifier<T>>;

abstract class Subject<T extends Concept> {
  private target: T;
  private enhancements: { attribute: Attribute, additionalInfo: ItemDefinitionInfo<any> }[] = [];

  constructor(target: T) {
    this.target = target;
  }

  where<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    this.enhancements.push({ attribute, additionalInfo });
    return this;
  }

  and<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    this.where(attribute, additionalInfo);
    return this;
  }

  resolve(queue: Thing[] = []): T {
    return this.enhancements.reduce((res: Thing, { attribute, additionalInfo }) => {
      if (additionalInfo) {
        if (additionalInfo instanceof Qualifier) {
          return res.withAttribute(attribute.withQualifier(attribute.qualifier.isPlain() ? additionalInfo : attribute.qualifier));
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

class ThingSubject extends Subject<Thing> {
  with<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    return this.where(attribute, additionalInfo);
  }

  being<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    return this.where(attribute, additionalInfo);
  }
}

class ContextThingSubject extends ThingSubject {
  resolve(queue: Thing[] = []): Thing {
    // XXX: implement context/queue-aware resolution
    return super.resolve(queue);
  }
}

class RelationSubject extends Subject<Relation> {
  public static none = new RelationSubject(Relation.nothing);

  how<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    return this.where(attribute, additionalInfo);
  }

  for<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): this {
    return this.where(attribute, additionalInfo);
  }
}

// TODO: split in 3 steps to force correct definition
class Capture {
  private target: ThingSubject;
  private application: RelationSubject;
  private result: ThingSubject | Thing;
  private next: Capture;

  constructor(subject: ThingSubject) {
    this.taking(subject);
  }

  taking(subject: ThingSubject): this {
    this.target = subject;
    return this;
  }

  perform(subject: RelationSubject): this {
    this.application = subject;
    return this;
  }

  toObtain(result: ThingSubject): this {
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

  resolve(queue: Thing[] = [], make: FoodJSMaker): Relation {
    if (this.target && this.application && this.result) {
      const resolvedTarget = this.target.resolve(queue);
      const resolvedApplication = this.application.resolve(queue);
      const resolvedResult = this.result instanceof Thing ? this.result : this.result.resolve();
      const resolvedRelation = resolvedApplication.withInput(resolvedTarget).withOutput(resolvedResult);
      if (this.next) {
        return this.next.resolve([...queue, resolvedRelation], make).withMergedInput(resolvedRelation);
      } else {
        return resolvedRelation;
      }
    } else {
      throw new Error('Capture must always define target, application and result');
    }
  }

}

interface DefContextUtils {
  requires(requirements: ThingSubject[]): void;
  summary(capture: Capture): void;
  taking(subject: ContextThingSubject): Capture;
  the(target: Thing): ContextThingSubject;
  some(target: Thing): ThingSubject;
  a(target: Thing): ThingSubject;
  action(relation: Relation): RelationSubject;
  all(...captures: Capture[]): Capture;
}

export class DefContext implements DefContextUtils {
  private requirements: ThingSubject[] = [];
  private summaryCapture: Capture;

  constructor(private make: FoodJSMaker) { }

  requires(requirements: ThingSubject[]): void {
    this.requirements = [ ...this.requirements, ...requirements ];
  }

  summary(capture: Capture): void {
    this.summaryCapture = capture;
  }

  some(target: Thing): ThingSubject {
    return new ThingSubject(target);
  }

  a(target: Thing): ThingSubject {
    return this.some(target);
  }

  taking(subject: ContextThingSubject): Capture {
    return new Capture(subject);
  }

  the(target: Thing): ContextThingSubject {
    return this.some(target);
  }

  action(relation: Relation): RelationSubject {
    return new RelationSubject(relation);
  }

  all(...captures: Capture[]) {
    return captures.reduce((res, cap) => res ? res.then(cap) : cap);
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
    the: context.the.bind(context),
    action: context.action.bind(context),
    all: context.all.bind(context)
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
