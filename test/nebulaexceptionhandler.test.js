var Configs = require('../nebula-node/config').Configs;
var NebulaConnPool = require('../nebula-node/net/NebulaConnPool').NebulaConnPool;

describe('#nebula exception handler', () => {
    it('test error: create connection failed', (done) => {
        var configs = new Configs()
        configs.setMaxConnectionPoolSize(0)
        configs.setAddresses([
            {
                'host': 'localhost',
                'port': 9669
            },
            {
                'host': '127.0.0.1',    // use another address on distributed deployment.
                'port': 9669
            }
        ])
        var pool = new NebulaConnPool()

        pool.init(configs)

        console.log('\nUnit Test: create connection exceeding the max pool size.')
        pool.getSession('test1', 'test')
        .then(function(session) {
            console.log("Session create successfully.")
            pool.close()
            delete pool
            done()
        }, function(session){
            console.log("Session create failed.")
            pool.close()
            delete pool
            done()
        })      
    })

    it('test error: no available graph service', (done) => {
        var configs = new Configs()
        var pool = new NebulaConnPool()

        pool.init(configs)

        console.log('\nUnit Test: no available graphd address.')
        pool.getSession('test1', 'test')
        .then(function(session) {
            console.log("Session create successfully.")
            pool.close()
            delete pool
            done()
        }, function(session){
            console.log("Session create failed.")
            pool.close()
            delete pool
            done()
        })      
    })

    it('test error: parameters are not configured', (done) => {
        var pool = new NebulaConnPool()

        console.log('\nUnit Test: parameters are not configured.')
        pool.getSession('test1', 'test')
        .then(function(session) {
            console.log("Session create successfully.")
            pool.close()
            delete pool
            done()
        }, function(session){
            console.log("Session create failed.")
            pool.close()
            delete pool
            done()
        })      
    })

    it('test error: connection timeout', (done) => {
        var configs = new Configs()
        configs.setAddresses([
            {
                'host': 'unknown',
                'port': 9669
            }
        ])
        var pool = new NebulaConnPool()

        pool.init(configs)

        console.log('\nUnit Test: can\'t connect to graph service.')
        pool.getSession('test1', 'test', retryConnect=true)
        .then(function(session) {
            console.log("Session create successfully.")
            pool.close()
            delete pool
            done()
        }, function(session){
            console.log("Session create failed.")
            pool.close()
            delete pool
            done()
        })      
    })
})