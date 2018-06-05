import { FoodJs, foodjs, FoodJSMaker } from "@food-js/core/foodjs";
import { Attribute, Qualifier, Relation, Thing } from "@food-js/core";
import { Concept } from "@food-js/core/concept";
import { summarized } from "@food-js/library/commons/core.concepts";

export const coreDslUnit = foodjs.unit('@food-js/core-dsl');
const { plugin } = coreDslUnit.make;

type Subject = Thing | ItemDefinition<Thing>;
type ItemDefinitionInfo<T extends Concept> = Qualifier<T> | ItemDefinition<T>;

class ItemDefinition<T extends Concept> {
  private target: Thing;
  private enhancements: { attribute: Attribute, additionalInfo: ItemDefinitionInfo<any> }[] = [];

  constructor(target: Thing) {
    this.target = target;
  }

  where<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): ItemDefinition<T> {
    this.enhancements.push({ attribute, additionalInfo });
    return this;
  }

  with<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): ItemDefinition<T> {
    return this.where(attribute, additionalInfo);
  }

  being<T extends Concept>(attribute: Attribute, additionalInfo: ItemDefinitionInfo<T> = Qualifier.plain): ItemDefinition<T> {
    return this.where(attribute, additionalInfo);
  }

  resolve(): Thing {
    return this.enhancements.reduce((res, { attribute, additionalInfo }) => {
      if (additionalInfo) {
        if (additionalInfo instanceof Qualifier) {
          return res.withAttribute(attribute.withQualifier(additionalInfo));
        } else {
          return res.withAttribute(attribute.withQualifier(additionalInfo.resolve()));
        }
      } else {
        return res.withAttribute(attribute);
      }
    }, this.target);
  }
}

abstract class Capture {
  abstract buildProduction(currentProduction: Relation, pool?: Thing[]): Relation;
}

type SubjectCaptureInfo<T extends Concept> = Qualifier<T> | SubjectCapture;

class SubjectCapture extends Capture {
  private application: Relation;
  private result: Thing;
  private adjustments: { attribute: Attribute, additionalInfo: SubjectCaptureInfo<any> }[] = [];

  constructor(private subject: Subject) {
    super();
  }

  adjust<T extends Concept>(attribute: Attribute, additionalInfo: SubjectCaptureInfo<T>): SubjectCapture {
    this.adjustments.push({ attribute, additionalInfo });
    return this;
  }

  apply(application: Relation): SubjectCapture {
    this.application = application;
    return this;
  }

  yields(result: Thing): SubjectCapture {
    this.result = result;
    return this;
  }

  buildProduction(currentProduction: Relation, pool?: Subject[]): Relation {
    // XXX
    return currentProduction;
  }
}

class ActionCapture extends Capture {
  private action: Relation;
  private attribute: Attribute;

  constructor(action: Relation) {
    super();
    this.action = action;
  }

  for(attribute: Attribute): ActionCapture {
    this.attribute = attribute;
    return this;
  }

  buildProduction(currentProduction: Relation, pool?: Subject[]): Relation {
    // XXX
    return currentProduction;
  }
}

class SequenceCapture extends Capture {
  constructor(private specs: Capture[]) {
    super();
  }

  buildProduction(currentProduction: Relation, pool?: Subject[]): Relation {
    // XXX
    return currentProduction;
  }
}

class ConcomitantCapture extends Capture {
  constructor(private specs: Capture[]) {
    super();
  }

  buildProduction(currentProduction: Relation, pool?: Subject[]): Relation {
    // XXX
    return currentProduction;
  }
}

interface DefContextUtils {
  requires(requirements: Subject[]): void;
  some<T extends Concept>(target: Thing): ItemDefinition<T>;
  a<T extends Concept>(target: Thing): ItemDefinition<T>;
  summary(capture: Capture): void;
  taking(subject: Subject): SubjectCapture;
  the(subject: Subject): SubjectCapture;
  sequence(...specs: Capture[]): SequenceCapture;
  concomitant(...specs: Capture[]): ConcomitantCapture;
  perform(action: Relation): ActionCapture;
}

export class DefContext implements DefContextUtils{
  private requirements: Subject[] = [];
  private summarySpec: Capture;

  constructor(private make: FoodJSMaker) { }

  requires(requirements: Subject[]): void {
    this.requirements = [ ...this.requirements, ...requirements ];
  }

  some<T extends Concept>(target: Thing): ItemDefinition<T> {
    return new ItemDefinition<T>(target);
  }

  a<T extends Concept>(target: Thing): ItemDefinition<T> {
    return this.some(target);
  }

  summary(capture: Capture): void {
    this.summarySpec = capture;
  }

  taking(subject: Subject): SubjectCapture {
    return new SubjectCapture(subject);
  }

  the(subject: Subject): SubjectCapture {
    return this.taking(subject);
  }

  sequence(...specs: Capture[]): SequenceCapture{
    return new SequenceCapture(specs);
  }

  concomitant(...specs: Capture[]): ConcomitantCapture {
    return new ConcomitantCapture(specs);
  }

  perform(action: Relation): ActionCapture {
    return new ActionCapture(action);
  }

  resolveRequirements(): Thing[] {
    return this.requirements.map(req => {
      if (req instanceof Thing) {
        return req;
      } else {
        return req.resolve();
      }
    });
  }

  buildUpon(rootProduction: Relation, rootCapture: Capture, summaryProduction: Relation): Relation {
    const resolvedRequirements = this.resolveRequirements();
    return rootCapture.buildProduction(rootProduction, resolvedRequirements)
      .withSynonym(this.summarySpec.buildProduction(summaryProduction));
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
    sequence: context.sequence.bind(context),
    concomitant: context.concomitant.bind(context),
    perform: context.perform.bind(context)
  };
}

type DefBuilderFunction = (utils: DefContextUtils) => Capture;

class DefBuilder {
  make: FoodJSMaker;
  context: DefContext;

  constructor(private foodjs: FoodJs, private code: string, private fn: DefBuilderFunction) {
    this.make = foodjs.make;
    this.context = new DefContext(this.make);
  }

  build(): Relation {
    const summaryProduction = this.make.production(this.code).withAttribute(summarized);
    const rootProduction = this.make.production(this.code); // starting point
    const rootCapture = this.fn(makeContextUtils(this.context)); // defines how the production will build
    return this.context.buildUpon(rootProduction, rootCapture, summaryProduction);
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
