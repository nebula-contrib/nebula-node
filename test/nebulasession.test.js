
var Configs = require('../nebula-node/config').Configs;
var NebulaConnPool = require('../nebula-node/net/NebulaConnPool').NebulaConnPool;

describe('#nebula session', () => {
    
    it('test function of Session\'s methods', (done) => {
        var configs = new Configs()
        configs.setMaxConnectionPoolSize(3)
        configs.setAddresses([
            {
                'host': 'localhost',
                'port': 9669
            }
        ])
        configs.addAddress('localhost', 9668)
        var pool = new NebulaConnPool()

        console.log('\nUnit Test: pool init & add address')
        pool.init(configs)
        console.log(pool.configs.addresses)

        console.log('\nUnit Test: delete address')
        configs.delAddress('localhost', 9668)
        console.log(pool.configs.addresses)

        console.log('\nUnit Test: getSession')
        pool.getSession('root', 'nebula')
        .then(function() {

            console.log('\nUnit Test: multiple session scenario')
            pool.getSession('sudo-user', 'testpasswd')
            .then(function() {

                console.log('\nUnit Test: create an existing session')
                pool.getSession('root', 'nebula')
                .then(function(session) {

                    console.log('\nUnit Test: execute nGQL stmt (async returned result)')
                    var result = session.execute('SHOW SPACES')
                    console.log(result)

                    console.log('\nUnit Test: release session')
                    session.release()

                    console.log('\nUnit Test: create a session using a free connection')
                    pool.getSession('superviser', 'testpasswd')
                    .then(function(session) {
                        session.release()

                        console.log('\nUnit Test: pool close (need to handle unreleased session & open connection)')
                        pool.close()
                        delete pool
                        done()
                    })
                }) 
            })   
        })        
    })

    it('test SessionInterface', (done) => {
        var configs = new Configs()
        configs.setMaxConnectionPoolSize(3)
        configs.setAddresses([
            {
                'host': 'localhost',
                'port': 9669
            }
        ])

        console.log('\nUnit Test: pool init & add address')
        var pool = new NebulaConnPool()
        pool.init(configs)

        console.log('\nUnit Test: getSession')
        pool.getSession('root', 'nebula')
        .then(function(session) {

            console.log('\nUnit Test: execute nGQL stmt (async returned result)')
            var result = session.execute('SHOW SPACES')
            console.log(result)

            console.log('\nUnit Test: release session')
            session.release()

            console.log('\nUnit Test: use method of a released session release (error expected, sync raised)')
            result = session.execute('SHOW SPACES')
            console.log(result)
            session.release()

            console.log('\nUnit Test: pool close (need to handle unreleased session & open connection)')
            pool.close()
            delete pool
            done()
        })
    })
})