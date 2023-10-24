/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */

import Int64 from 'node-int64';
import _ from 'lodash';
import {
  getNebulaValueTypeName,
  isNebulaValue,
  NebulaDataParserList,
} from './utils';
import * as native from '../../native';

const getNebulaValue = (obj: any): any => {
  if (!isNebulaValue(obj)) {
    return obj;
  }

  const propName = getNebulaValueTypeName(obj);
  const parser = NebulaDataParserList.find((parser) => parser.match(propName));
  return parser ? parser.parse(obj, propName) : null;
};

const convert = (entity: any): any => {
  if (_.isFunction(entity)) {
    return undefined;
  } else if (isNebulaValue(entity)) {
    const obj = getNebulaValue(entity);
    if (_.isDate(entity)) {
      return entity;
    } else if (_.isArray(obj) || _.isPlainObject || _.isObject(obj)) {
      return convert(obj);
    }
    return obj;
  } else if (_.isArray(entity)) {
    const out = [];
    _.forEach(entity, (o) => {
      out.push(convert(o));
    });
    return out;
  } else if (_.isPlainObject(entity)) {
    const out = {};
    const keys = _.keys(entity);
    _.forEach(keys, (key) => {
      const o = entity[key];
      out[key] = convert(o);
    });
    return out;
  } else if (entity instanceof Int64) {
    if (isFinite(entity.valueOf())) {
      return +entity.toString();
    } else {
      if (entity.buffer) {
        return native.bytesToLongLongString(entity.buffer as any);
      }
      return entity.toOctetString();
    }
  } else if (_.isDate(entity)) {
    return entity;
  } else if (_.isObject(entity)) {
    return convert(_.toPlainObject(entity));
  } else {
    return entity;
  }
};

const traverse = (obj: any): any => {
  const start = Date.now();
  const result = convert(obj);
  const columns = result?.data?.column_names;
  const rows = result?.data?.rows;
  if (columns && rows) {
    const entity = {};
    _.forEach(columns, (c) => {
      entity[c] = [];
    });

    _.forEach(rows, (row) => {
      _.forEach(columns, (c, i) => {
        entity[c].push(row.values[i]);
      });
    });

    result.data = entity;
  }

  const end = Date.now();
  result.metrics = result.metrics ?? { execute: 0, traverse: 0 };
  result.metrics.traverse = end - start;

  return result;
};

export default traverse;
