/**
 * Created by Zhao Xiaotian on - 2021/11/10.
 */

import { prometheus } from '@qcc/metrics'
import { Counter } from 'prom-client'

const NEBULA_QUERY_EXEC_COUNT = 'nebula_query_exec_count'
const NEBULA_QUERY_SLOW_COUNT = 'nebula_query_slow_count'
const NEBULA_QUERY_ERROR_COUNT = 'nebula_query_error_count'

class Metrics {
  private readonly nebulaQueryExecMetric: Counter<string>
  private readonly nebulaQuerySlowMetric: Counter<string>
  private readonly nebulaQueryErrorMetric: Counter<string>

  constructor() {
    this.nebulaQueryExecMetric = new prometheus.Counter({
      name: NEBULA_QUERY_EXEC_COUNT,
      help: 'nebula query exec count.',
      labelNames: ['host', 'database']
    })

    this.nebulaQuerySlowMetric = new prometheus.Counter({
      name: NEBULA_QUERY_SLOW_COUNT,
      help: 'nebula query slow count.',
      labelNames: ['host', 'database']
    })

    this.nebulaQueryErrorMetric = new prometheus.Counter({
      name: NEBULA_QUERY_ERROR_COUNT,
      help: 'nebula query error count.',
      labelNames: ['host', 'database']
    })
  }

  nebulaQueryExecInc(host: string, database: string) {
    this.nebulaQueryExecMetric.inc({ host, database })
  }

  nebulaQuerySlowInc(host: string, database: string) {
    this.nebulaQuerySlowMetric.inc({ host, database })
  }

  nebulaQueryErrorInc(host: string, database: string) {
    this.nebulaQueryErrorMetric.inc({ host, database })
  }
}

export default new Metrics()
