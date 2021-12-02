/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Created by Wu Jian Ping on - 2021/06/10.
 */

import _ from 'lodash'
import { NebulaValue } from '../types'

const NubulaValueTypeNames = [
  'nVal',
  'bVal',
  'iVal',
  'fVal',
  'sVal',
  'dVal',
  'tVal',
  'dtVal'
]

/**
 * 获取nebula对象的类型名称
 *
 * @param obj
 * @returns
 */
const getNebulaValueTypeName = (obj: NebulaValue): string => {
  return _.chain(obj).keys().filter(k => obj[k] !== null).first().value()
}

/**
 * 判断一个对象类型是否为nubela数据类型
 *
 * @param obj
 * @returns
 */
const isNebulaValue = (obj: any): boolean => {
  return obj && obj.nVal !== undefined
}

const isNebulaValueTypeName = (propName: string): boolean => {
  return _.includes(NubulaValueTypeNames, propName)
}

const isNebulaNListTypeName = (propName: string): boolean => {
  return propName === 'lVal'
}

const isNebulaVertexTypeName = (propName: string): boolean => {
  return propName === 'vVal'
}

const isNebulaEdgeTypeName = (propName: string): boolean => {
  return propName === 'eVal'
}

const isNebulaPathTypeName = (propName: string): boolean => {
  return propName === 'pVal'
}

export default {
  isNebulaValueTypeName,
  isNebulaNListTypeName,
  isNebulaVertexTypeName,
  isNebulaEdgeTypeName,
  isNebulaPathTypeName,
  isNebulaValue,
  getNebulaValueTypeName
}
