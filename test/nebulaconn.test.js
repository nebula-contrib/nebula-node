/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

var GraphTtypes = require('../nebula-node/interface/graph_types');
var NebulaConn = require('../nebula-node/net/Connection').Connection
const assert = require('assert');
const expect = require('chai').expect

describe('#nebula connection', () => {
    it('test open succeeded', () => {
        var conn = new NebulaConn('localhost', 9669, 1000)
        try {
            conn.open()
            conn.close()
        } catch (e) {
            assert(false, 'Expected open succeeded, but:' + e.stack)
        }

    })

    it('test authenticate', (done) => {
        var conn = new NebulaConn('localhost', 9669, 1000)
        try {
            conn.open()
            conn.authenticate('root', 'nebula', function (response) {
                assert(response.success.error_code == 0)
                assert(response.success.session_id != 0)
                conn.signout(response.success.session_id)
                done()
                conn.close()
            })
        } catch (e) {
            conn.close()
            assert(false, 'Expected open succeeded, but: ' + e.stack)
        }

    })

    it('test execute', (done) => {
        var conn = new NebulaConn('localhost', 9669, 1000)
        try {
            conn.open()
            conn.authenticate('root', 'nebula', function (response) {
                assert(response.success.error_code == 0)
                assert(response.success.session_id != 0)
                sessionId = response.success.session_id
                conn.execute(sessionId, 'CREATE SPACE IF NOT EXISTS test', function (response) {
                    assert(response.success.error_code == 0)
                    console.log(response.success)
                    conn.execute(sessionId, 'DESC SPACE test', function (response) {
                        console.log(response.success.data)
                        assert(response.success.error_code == 0)
                        expect(response.success.data.column_names[0]).to.equal('ID')
                        expect(response.success.data.column_names[1]).to.equal('Name')
                        expect(response.success.data.column_names[2]).to.equal('Partition Number')
                        expect(response.success.data.column_names[3]).to.equal('Replica Factor')
                        expect(response.success.data.column_names[4]).to.equal('Charset')
                        expect(response.success.data.column_names[5]).to.equal('Collate')
                        expect(response.success.data.column_names[6]).to.equal('Vid Type')
                        expect(response.success.data.rows.length).to.equal(1)
                        expect(response.success.data.rows[0].values[1].sVal).to.equal('test')
                        expect(parseInt(response.success.data.rows[0].values[2].iVal.buffer.toString('hex'))).to.equal(64)
                        expect(parseInt(response.success.data.rows[0].values[3].iVal.buffer.toString('hex')), 1)
                        expect(response.success.data.rows[0].values[4].sVal, 'utf8')
                        expect(response.success.data.rows[0].values[5].sVal, 'utf8_bin')
                        expect(response.success.data.rows[0].values[6].sVal, 'FIXED_STRING(8)')
                        done()
                        conn.close()

                    })

                })
            })

        } catch (e) {
            conn.close()
            assert(false, 'Expected open succeeded, but: ' + e.stack)
        }

    })

    // it('test open failed', () => {
    //     var conn = new NebulaConn('localhost', 3999, 1000)
    //     try {
    //         conn.open()
    //         conn.close()
    //     } catch (e) {
    //         assert(true, 'Expected open failed, but: ' + e.stack)
    //     }
    //
    // })
})
