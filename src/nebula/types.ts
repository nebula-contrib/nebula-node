/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */

import { AsyncResource } from 'async_hooks'

export interface ConnectionOption {
  host: string;
  port: number;
  userName: string;
  password: string;
  space: string;
}

export interface Endpoint {
  host: string;
  port: number
}

export interface ClientOption {
  // nebula服务器列表
  servers: string[] | Endpoint[];
  // 用户名
  userName: string;
  // 密码
  password: string;
  // 数据库名称
  space: string;
  // 连接池大小，默认：5
  poolSize?: number;
  // 缓存区大小，默认：2000
  bufferSize?: number;
  // 查询超时（毫秒），包含在队列中等待时间和真正执行时间， 默认：10000
  executeTimeout?: number;
  // ping轮询时间（毫秒）， 默认：30000
  pingInterval?: number;
}

export interface ConnectionInfo {
  connectionId: string;
  host: string;
  port: number;
  space: string;
  isReady: boolean;
}


/**
 * - nVal: NullType
 * - bVal: bool
 * - iVal: i64
 * - fVal: double
 * - sVal: string
 * - dVal: Date
 * - tVal: Time
 * - dtVal: DateTime
 * - vVal: Vertex
 * - eVal: Edge
 * - pVal: Path
 * - lVal: NList
 * - mVal: NMap
 * - uVal: NSet
 * - gVal: DataSet
 * - ggVal: Geography
 * - duVal: Duration
 */
export interface NebulaValue {
  nVal: any;
  bVal: any;
  iVal: any;
  fVal: any;
  sVal: any;
  dVal: any;
  tVal: any;
  dtVal: any;
  vVal: any;
  eVal: any;
  pVal: any;
  lVal: {
    values: any[];
  };
  mVal: any;
  uVal: any;
  gVal: any;
}
export interface Metrics {
  execute: number;
  traverse: number;
}

export interface Task {
  command: string;
  returnOriginalData: boolean;
  resolve: (value: any) => void;
  reject: (err: any) => void;
  asyncResource?: AsyncResource;
  executingTimer?: NodeJS.Timeout;
}
