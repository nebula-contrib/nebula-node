
var Configs = require('../nebula-node/config').Configs;
var NebulaConnPool = require('../nebula-node/net/NebulaConnPool').NebulaConnPool;

describe('#nebula loadbalancer', () => {
    it('test load balancer for connection pool', (done) => {
        var configs = new Configs()
        configs.setMaxConnectionPoolSize(6)
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

        console.log('\nUnit Test: pool init & add address')
        pool.init(configs)
        console.log(pool.configs.addresses)

        console.log('\nUnit Test: load balancer')
        pool.getSession('test1', 'test')
        .then(function() {

            pool.getSession('test2', 'test')
            .then(function() {

                pool.getSession('test3', 'test')
                .then(function(session) {

                    pool.getSession('test4', 'test')
                    .then(function(session) {

                        pool.getSession('test5', 'test')
                        .then(function(session) {

                            pool.close()
                            delete pool
                            done()
                        })
                    })
                }) 
            })   
        })        
    })
})