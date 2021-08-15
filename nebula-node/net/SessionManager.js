var NebulaSession = require('./Session').NebulaSession;
var eventEmitter = require('../events').eventEmitter;

var SessionManager = exports.SessionManager = function() {
    this.sessions = {};
    
    var that = this;
    eventEmitter.on('releaseSession', function(userName) {
        for (var key in that.sessions) {
            if (key === userName) {
                eventEmitter.emit('setConnFree', that.sessions[key].conn.sttime);
                delete that.sessions[key];
                console.log('[INFO]: Session of the username: ' + key + ' released successfully!');
                console.log('[INFO]: Session Count: ' + that.getSessionNum());
            }
        }
    });

    eventEmitter.on('connPoolClose', function() {
        for (var key in that.sessions) {
            delete that.sessions[key];
            console.log('[WARNING]: Session of the username: ' + key + ' released due to Connection Pool closing!');
        }
    });
}

SessionManager.prototype.getSessionNum = function() {
    return Object.keys(this.sessions).length;
}

SessionManager.prototype.findByUserName = function(userName) {
    for (var key in this.sessions) {
        if (this.sessions[key].userName === userName && this.sessions[key].status === 'working') {
            console.log('[WARNING]: Session of the username: ' + userName + ' already exists! Use it instead!');
            return this.sessions[key];
        }
    }
    return null;
}

SessionManager.prototype.createSession = function(userName, sessionId, conn) {
    var newSession = new NebulaSession();
    newSession.sessionId = sessionId;
    newSession.userName = userName;
    newSession.conn = conn;
    this.sessions[userName] = newSession;
    console.log('[INFO]: Session Count: ' + this.getSessionNum());
    return newSession;
}

// SessionManager.prototype.cleanup = function(sessions) {
//     var curTime = new Date().getTime;
//     for (var id in sessions) {
//         var session = sessions[id];
//         if (session.expiredTime < curTime) {
//             delete sessions[id];
//         }
//     }
// }

var getIdFromCookie = function(req) {
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(
        function(Cookie) {
            var parts = Cookie.split('=');
            Cookies[parts[0].trim()] = (parts[1] || '').trim();
        }        
    );
    console.info(Cookies);
    console.info(Cookies['D_SID']);
    if (Cookies['D_SID']) {
        return (Cookies['D_SID']);
    }
}

