import '../../test-util';
import * as assert from "assert";
import { Queue } from "@food-js/lib-core-dsl/define/capture/queue";

describe.only('Queue', () => {
  it('.empty().toString() should represent empty', () => {
    assert.equal(Queue.empty().toString(), '<<>>');
  });

  it('.toString() should represent items', () => {
    assert.equal(new Queue(['a', 'b', 1]).toString(), '<<a; b; 1>>');
  });

  it('.adding() should create a new queue', () => {
    const q1 = new Queue(['a', 'b', 1]);
    const q2 = q1.adding(2, 3);
    assert(q1 !== q2);
    assert.equal(q1.toString(), '<<a; b; 1>>');
    assert.equal(q2.toString(), '<<a; b; 1; 2; 3>>');
  });
});
