import { Attribute, Qualifier, Relation, Thing } from "@food-js/core";
import { Concept } from "@food-js/core/concept";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";
import { logger } from "@food-js/utils/logger";

export type ItemDefinitionInfo<T extends Concept> = Qualifier<T> | Subject<T> | Array<Qualifier<T>>;

export abstract class Subject<T extends Concept, Q extends Concept = T> {

  protected target: T;
  protected enhancements: { attribute: Attribute, additionalInfo: ItemDefinitionInfo<any> }[] = [];

  protected constructor(target: T) {
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

  resolve(queue: Queue<Q>, resolution: 'find' | 'spawn' | 'find-or-spawn' = 'find-or-spawn'): Q {
    logger.debug(`Resolving(${resolution}): ${this.target.toString()}`);
    logger.debug(`Queue: ${queue.toString()}`);
    if (resolution === 'find') {
      return this.find(queue, true);
    } else if (resolution === 'find-or-spawn') {
      return this.find(queue, false) || this.spawn(queue);
    } else if (resolution === 'spawn') {
      return this.spawn(queue);
    }
  }

  private find(queue: Queue<Q>, mustFind = false): Q {
    // XXX: find in queue using a matcher structure
    let found = queue.findLast(item => item instanceof Relation && item.output.code === this.target.code);
    if (!found) {
      found = queue.find(item => item.code === this.target.code);
    }

    if (mustFind && !found) {
      throw new Error(`Cannot find target "${this.target.toString()}" in current queue: ${queue.toString()}`);
    }
    if (found) {
      if (found instanceof Relation) {
        return found.output as any;
      }
      logger.debug(`Found: ${found}`);
      return found;
    } else {
      logger.debug(`Target not found`);
    }
  }

  private spawn(queue: Queue<Q>) {
    const spawned = this.enhancements.reduce((res: Thing, { attribute, additionalInfo }) => {
      if (additionalInfo) {
        if (additionalInfo instanceof Qualifier) {
          return res.withAttribute(attribute.withQualifier(attribute.qualifier.isPlain() ? additionalInfo : attribute.qualifier));
        } else if (additionalInfo instanceof Subject) {
          return res.withAttribute(attribute.withQualifier(additionalInfo.resolve(queue)));
        } else {
          return (additionalInfo as any[]).reduce((thing, q) => thing.withAttribute(attribute.withQualifier(q)), res)
        }
      } else {
        return res.withAttribute(attribute);
      }
    }, this.target);
    logger.debug(`Spawned: ${spawned}`);
    return spawned;
  }

  toStringBase() {
    if (this.enhancements && this.enhancements.length > 0) {
      return `(${this.target} w/ ${this.enhancements.map(e => e.toString()).join(' & ')})`;
    } else {
      return `(${this.target})`;
    }
  }

  toString() {
    return `~:${this.toStringBase()}`;
  }

}
