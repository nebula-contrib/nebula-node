/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */

import { AsyncResource } from 'async_hooks'

interface ConnectionOption {
  host: string;
  port: number;
  userName: string;
  password: string;
  database: string;
  threshold: number;
}

interface Endpoint {
  host: string;
  port: number
}

interface ClientOption {
  // nebula服务器列表
  servers: string[] | Endpoint[];
  // 用户名
  userName: string;
  // 密码
  password: string;
  // 数据库名称
  database: string;
  // 连接池大小，默认：5
  poolSize?: number;
  // 缓存区大小，默认：2000
  bufferSize?: number;
  // 慢查询阀值（毫秒）， 默认：300
  threshold?: number;
  // 查询超时（毫秒），包含在队列中等待时间和真正执行时间， 默认：10000
  executeTimeout?: number;
  // ping轮询时间（毫秒）， 默认：30000
  pingInterval?: number;
}

interface ConnectionInfo {
  connectionId: string;
  host: string;
  port: number;
  database: string;
  isReady: boolean;
}

interface NebulaValue {
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
interface Metrics {
  execute: number;
  traverse: number;
}

interface Task {
  command: string;
  returnOriginalData: boolean;
  resolve: (value: any) => void;
  reject: (err: any) => void;
  asyncResource?: AsyncResource;
  executingTimer?: NodeJS.Timeout;
}

export {
  Endpoint,
  ClientOption,
  ConnectionOption,
  NebulaValue,
  Metrics,
  Task,
  ConnectionInfo
}
