/* Copyright (c) 2021 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

var GraphTtypes = require('../nebula/interface/graph_types');
var NebulaConn = require("../nebula/net/NebulaConn").NebulaConn

printRows = function (rows) {
    rows.forEach( function(row) {
        row.values.forEach( function(value) {
             if (value) {
                if (value.nVal !== null) {
                    console.log(value.nVal)
                }
                if (value.bVal !== null) {
                    console.log(value.bVal)
                }
                if (value.iVal !== null) {
                    console.log(value.iVal.buffer.toString('hex'))
                }
                if (value.fVal !== null) {
                    console.log(value.fVal)
                }
                if (value.sVal !== null) {
                    console.log('"' + value.sVal + '"')
                }
                if (value.dVal !== null) {
                    console.log(value.dVal)
                }
                if (value.tVal !== null) {
                    console.log(value.tVal)
                }
                if (value.dtVal !== null) {
                    console.log(value.dtVal)
                }
                if (value.vVal !== null) {
                    console.log(value.vVal)
                }
                if (value.eVal !== null) {
                    console.log(value.eVal)
                }
                if (value.pVal !== null) {
                    console.log(value.pVal)
                }
                if (value.lVal !== null) {
                    console.log(value.lVal)
                }
                if (value.mVal !== null) {
                    console.log(value.mVal)
                }
                if (value.uVal !== null) {
                    console.log(value.uVal)
                }
                if (value.gVal !== null) {
                    console.log(value.gVal)
                }
            }
        })
    })
}

var conn = new NebulaConn('127.0.0.1', 9669, 1000)
try {
    conn.open()
    conn.authenticate('root', 'nebula', function (response) {
        sessionId = response.success.session_id
        conn.execute(sessionId, 'SHOW HOSTS', function (response) {
            if (response.success.error_code == 0) {
                console.log(response.success.data.column_names)
                printRows(response.success.data.rows)
            }
            conn.close()
        })
    })
} catch (e) {
    conn.close()
    console.log('Catch: ' + e.stack)
}