
var Configs = require("../nebula/config").Configs;
var NebulaConnPool = require("../nebula/net/NebulaConnPool").NebulaConnPool;
// var NebulaSession = require("../nebula/net/Session").NebulaSession;

describe('#nebula session', () => {
    it('test base function of session', () => {
        var configs = new Configs()
        configs.setMaxConnectionPoolSize(3);
        var pool = new NebulaConnPool()
        pool.init([], configs)
        console.log("test")
        pool.getSession('root', 'nebula')
        .then(function(session) {
            console.log(session)
            console.log('getSession Successfully!')
            session.execute('SHOW SPACES')
            .then(function() {
                console.log('execute Successfully!')
                session.release()
                pool.close()
                console.log(pool.sessions)
                console.log("test")
            })
        })       
    })
})