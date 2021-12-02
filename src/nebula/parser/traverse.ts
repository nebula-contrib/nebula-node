/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */

import _ from 'lodash'
import Int64 from 'node-int64'
import valueParse from './value'
import utils from './utils'
import listParser from './list'
import vertexParser from './vertex'
import edgeParser from './edge'
import pathParser from './path'
import native from '../../native'

const getNebulaValue = (obj: any): any => {
  if (utils.isNebulaValue(obj)) {
    const propName = utils.getNebulaValueTypeName(obj)
    if (propName) {
      if (utils.isNebulaValueTypeName(propName)) {
        return valueParse(obj, propName)
      } else if (utils.isNebulaNListTypeName(propName)) {
        return listParser(obj, propName)
      } else if (utils.isNebulaVertexTypeName(propName)) {
        return vertexParser(obj, propName)
      } else if (utils.isNebulaEdgeTypeName(propName)) {
        return edgeParser(obj, propName)
      } else if (utils.isNebulaPathTypeName(propName)) {
        return pathParser(obj, propName)
      } else {
        return {
          [propName]: obj[propName]
        }
      }
    }
    return null
  }
  return obj
}

const convert = (entity: any): any => {
  if (_.isFunction(entity)) { // 去掉函数
    return undefined
  } else if (utils.isNebulaValue(entity)) { // 解析nebula数据
    const obj = getNebulaValue(entity)
    if (_.isDate(entity)) {
      return entity
    } else if (_.isArray(obj) || _.isPlainObject || _.isObject(obj)) {
      return convert(obj)
    }
    return obj
  } else if (_.isArray(entity)) { // 处理数组
    const out = []
    _.forEach(entity, o => {
      out.push(convert(o))
    })
    return out
  } else if (_.isPlainObject(entity)) { // 处理对象
    const out = {}
    const keys = _.keys(entity)
    _.forEach(keys, key => {
      const o = entity[key]
      out[key] = convert(o)
    })
    return out
  } else if (entity instanceof Int64) { // 处理未遵循规范的i64值, 如：'ranking'属性，并没有按照标准进行封装，只是放了一个i64
    if (isFinite(entity.valueOf())) {
      return +entity.toString()
    } else {
      if (entity.buffer) {
        return native.bytesToLongLongString(entity.buffer as any)
      }
      return entity.toOctetString()
    }
  } else if (_.isDate(entity)) { // Date同时是Object
    return entity
  } else if (_.isObject(entity)) {
    return convert(_.toPlainObject(entity))
  } else {
    return entity
  }
}

const traverse = (obj: any): any => {
  const start = Date.now()
  const result = convert(obj)
  const columns = result?.data?.column_names
  const rows = result?.data?.rows
  if (columns && rows) {
    const entity = {}
    _.forEach(columns, c => {
      entity[c] = []
    })

    _.forEach(rows, row => {
      _.forEach(columns, (c, i) => {
        entity[c] = _.concat(entity[c], row.values[i])
      })
    })

    result.data = entity
  }

  const end = Date.now()
  result.metrics = result.metrics ?? { execute: 0, traverse: 0 }
  result.metrics.traverse = end - start

  return result
}

export default traverse
