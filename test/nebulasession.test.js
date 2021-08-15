
var Configs = require("../nebula-node/config").Configs;
var NebulaConnPool = require("../nebula-node/net/NebulaConnPool").NebulaConnPool;
// var NebulaSession = require("../nebula/net/Session").NebulaSession;

describe('#nebula session', () => {
    it('test base function of session', () => {
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
        pool.init(configs)
        console.log('test: ')
        console.log(pool.addresses)
        configs.delAddress('localhost', 9668)
        console.log('test: ')
        console.log(pool.addresses)

        pool.getSession('root', 'nebula')
        .then(function(session) {
            console.log('test: ')
            console.log(session)
            console.log('test: getSession Successfully!')
            session.execute('SHOW SPACES')
            .then(function() {
                console.log('test: execute Successfully!')
                session.release()
                console.log('test: ')
                console.log(pool.sessions)
                pool.close()
            })
        })       
    })
})