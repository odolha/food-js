import { isArray, isObject } from "../../common/utils/types.mjs";

export class ConfigObject {

  constructor(configSpec) {
    this.$configSpec = configSpec;

    this.$code = null;
    this.$root = null;
    this.$parent = null;
    this.$children = [];
  }

  _processRaw(obj) {
    return Object.keys(obj).reduce((res, key) => {
      if (!key.startsWith('$')) {
        if (obj[key] instanceof ConfigObject) {
          res[key] = obj[key].raw();
        } else if (obj[key] && isArray(obj[key])) {
          res[key] = obj[key].map(v => {
            if (isObject(v)) {
              return this._processRaw(v);
            } else {
              return v;
            }
          });
        } else if (obj[key] && isObject(obj[key])) {
          res[key] = this._processRaw(obj[key]);
        } else {
          res[key] = obj[key];
        }
      }
      return res;
    }, {});
  }

  getSubCodes() {
    return this.$children.map(c => c.$code);
  }

  getCode() {
    return this.$code;
  }

  getFullConfigCode() {
    return `${this.$parent ? `${this.$parent.getFullConfigCode()}/` : ''}${this.$code}`;
  }

  raw() {
    return this._processRaw(this);
  }

  _processClone(obj) {
    return Object.keys(obj).reduce((res, key) => {
      if (!key.startsWith('$')) {
        if (obj[key] instanceof ConfigObject) {
          res[key] = obj[key].clone();
        } else if (obj[key] && isArray(obj[key])) {
          res[key] = obj[key].map(v => {
            if (isObject(v)) {
              return this._processClone(v);
            } else {
              return v;
            }
          });
        } else if (obj[key] && isObject(obj[key])) {
          res[key] = this._processClone(obj[key]);
        } else {
          res[key] = obj[key];
        }
      }
      return res;
    }, {});
  }

  clone() {
    return new ConfigObject(this._processClone(this.$configSpec));
  }

  addChild(key, child) {
    child.init(this.$root, this, key);
    this.$children.push(child);
  }

  init(root, parent, code) {
    this.$code = code;
    this.$root = root;
    this.$parent = parent;

    let common = this.$configSpec['$common'];
    if (common  && !(common instanceof ConfigObject)) {
      common = new ConfigObject(common);
    }

    if (common) {
      this.$configSpec = Object.keys(this.$configSpec).reduce((res, key) => {
        const val = this.$configSpec[key];
        if (!key.startsWith('$')) {
          if (val && !(val instanceof ConfigObject) && isObject(val)) {
            res[key] = new ConfigObject(Object.assign({}, common.clone().$configSpec, val));
          } else {
            res[key] = val
          }
        }
        return res;
      }, {});
    }

    Object.keys(this.$configSpec).filter(key => !key.startsWith('$')).forEach(key => {
      let val = this.$configSpec[key];

      const processOne = val => {
        if (val && !(val instanceof ConfigObject) && isObject(val)) {
          val = new ConfigObject(val);
        }

        if (val instanceof ConfigObject) {
          val.init(root, this, key);
          this.$children.push(val);
        }

        return val;
      };

      if (isArray(val)) {
        val = val.map(v => processOne(v));
      } else {
        val = processOne(val);
      }

      this[key] = val;
    });

    delete this.$configSpec;
  }

}