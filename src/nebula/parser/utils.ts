/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Created by Wu Jian Ping on - 2021/06/10.
 */

import Int64 from 'node-int64';
import { bytesToLongLongString } from '../../native';
import { NebulaValue } from '../types';

/**
 * - nVal: NullType
 * - bVal: bool
 * - iVal: i64
 * - fVal: double
 * - sVal: string
 * - dVal: Date
 * - tVal: Time
 * - dtVal: DateTime
 * - gVal: DataSet
 */
const NebulaValueTypeNameSet = new Set([
  'nVal',
  'bVal',
  'iVal',
  'fVal',
  'sVal',
  'dVal',
  'tVal',
  'dtVal',
  'gVal',
]);

export const getNebulaValueTypeName = (obj: NebulaValue): string => {
  return Object.entries(obj).find(([, v]) => v !== null)?.[0];
};

export const isNebulaValue = (obj: any): boolean => {
  return obj?.nVal !== undefined;
};

const valueParser = (obj: NebulaValue, prop: string) => {
  // for i64
  const v = obj[prop];
  if (!(v instanceof Int64)) {
    return v;
  }
  if (isFinite(v.valueOf())) {
    return +v.toString();
  }
  if (v.buffer) {
    return bytesToLongLongString(v.buffer as any);
  }
  return v.toOctetString();
};

export const NebulaDataParserList = [
  {
    name: 'NebulaValue',
    match: (prop: string) => NebulaValueTypeNameSet.has(prop),
    parse: valueParser,
  },
  {
    name: 'NebulaNList',
    match: (prop: string) => prop === 'lVal',
    parse: (obj: NebulaValue, prop: string) => obj[prop].values || [],
  },
  {
    name: 'NebulaVertex',
    match: (prop: string) => prop === 'vVal',
    parse: (obj: NebulaValue, prop: string) => obj[prop],
  },
  {
    name: 'NebulaEdge',
    match: (prop: string) => prop === 'eVal',
    parse: (obj: NebulaValue, prop: string) => obj[prop],
  },
  {
    name: 'NebulaPath',
    match: (prop: string) => prop === 'pVal',
    parse: (obj: NebulaValue, prop: string) => obj[prop],
  },
  {
    name: 'NebulaNMap',
    match: (prop: string) => prop === 'mVal',
    parse: (obj: NebulaValue, prop: string) => obj[prop].kvs || {},
  },
  {
    name: 'NebulaNSet',
    match: (prop: string) => prop === 'uVal',
    parse: (obj: NebulaValue, prop: string) => obj[prop].values || [],
  },
  {
    name: 'NebulaNDataSet',
    match: (prop: string) => prop === 'gVal',
    parse: (obj: NebulaValue, prop: string) => obj[prop],
  },
];
