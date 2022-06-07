/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Created by Wu Jian Ping on - 2021/06/10.
 */

import { NebulaValue } from '../types'
import _ from 'lodash'

const NubulaValueTypeNames = [
  'nVal',
  'bVal',
  'iVal',
  'fVal',
  'sVal',
  'dVal',
  'tVal',
  'dtVal',
  'mVal',
  'uVal',
  'gVal'
]


const getNebulaValueTypeName = (obj: NebulaValue): string => {
  return _.chain(obj).keys().filter(k => obj[k] !== null).first().value()
}

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

const isNebulaNMapTypeName = (propName: string): boolean => {
  return propName === 'mVal'
}

const isNebulaNSetTypeName = (propName: string): boolean => {
  return propName === 'uVal'
}

const isNebulaNDataSetTypeName = (propName: string): boolean => {
  return propName === 'gVal'
}

export default {
  isNebulaValueTypeName,
  isNebulaNListTypeName,
  isNebulaVertexTypeName,
  isNebulaEdgeTypeName,
  isNebulaPathTypeName,
  isNebulaValue,
  isNebulaNMapTypeName,
  isNebulaNSetTypeName,
  isNebulaNDataSetTypeName,
  getNebulaValueTypeName
}
