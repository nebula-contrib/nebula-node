var NebulaSession = require('./Session').NebulaSession;
var eventEmitter = require('../events').eventEmitter;

var SessionRecorder = exports.SessionRecorder = function() {
    this.sessions = {};
    
    var that = this;
    eventEmitter.on('releaseSession', function(sessionId) {
        for (var key in that.sessions) {
            if (that.sessions[key].sessionId === sessionId) {
                eventEmitter.emit('setConnFree', that.sessions[key].conn.sttime, sessionId);
                delete that.sessions[key];
                console.log('SessionRecorder: [INFO]: Session ID: ' + key + ' released successfully.');
                console.log('SessionRecorder: [INFO]: Session Count: ' + that.getSessionNum());
            }
        }
    });

    eventEmitter.on('connPoolClose', function() {
        for (var key in that.sessions) {
            that.sessions[key].release();
            delete that.sessions[key];
            console.log('SessionRecorder: [WARNING]: Session ID: ' + key + ' released due to Connection Pool closing.');
        }
    });

    eventEmitter.on('getSessionById', function(sessionInterface) {
        sessionInterface.tmpSession = that.getSessionById(sessionInterface.sessionId);
    });
}

SessionRecorder.prototype.getSessionNum = function() {
    return Object.keys(this.sessions).length;
}

SessionRecorder.prototype.createSession = function(userName, sessionId, conn, timeout, retryConnect, password) {
    var newSession = new NebulaSession();
    newSession.sessionId = sessionId;
    newSession.userName = userName;
    newSession.conn = conn;
    newSession.timeout = timeout;
    newSession.retryConnect = retryConnect;
    newSession.password = password;
    this.sessions[sessionId] = newSession;
    console.log('SessionRecorder: [INFO]: Session ID: ' + sessionId + ' is created successfully.');
    console.log('SessionRecorder: [INFO]: Session Count: ' + this.getSessionNum());
    return newSession;
}

SessionRecorder.prototype.getSessionById = function(sessionId) {
    if (sessionId in this.sessions) {
        if (this.sessions[sessionId].status == 'bad-conn') {
            //error handle
            console.log('SessionRecorder: [ERROR]: Session ID: ' + sessionId + ' has a bad connection that can\'t be used.');
            return -2;
        } else if (this.sessions[sessionId].status == 'released') {
            //error handle
            console.log('SessionRecorder: [ERROR]: Session ID: ' + sessionId + ' has been released.');
            return -1;
        } else {
            // status: working
            console.log('SessionRecorder: [INFO]: Session ID: ' + sessionId + ' returned.')
            return this.sessions[sessionId];
        }
    } else {
        // error handle
        console.log('SessionRecorder: [ERROR]: Session ID: ' + sessionId + ' is not created or has been released.');
        return -1;
    }
}

SessionRecorder.prototype.getSessionByUserName = function(userName) {
    for (var sessionId in this.sessions) {
        if (this.sessions[sessionId].userName === userName && this.sessions[sessionId].status === 'working') {
            return this.sessions[sessionId];
        }
    }
    return null;
}

// SessionRecorder.prototype.cleanup = function(sessions) {
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