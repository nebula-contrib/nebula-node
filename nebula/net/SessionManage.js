var Session = require("./Session").NebulaSession;

var SessionManage = exports.SessionManage = function(expireInterval, cleanupInterval) {
    this.expireInterval = expireInterval || 100;
    this.cleanupInterval = cleanupInterval || 1000;
    this.sessions = {};
    setInterval(this.cleanupInterval, this.cleanupInterval, this.sessions)
}

var init = function(expireInterval, cleanupInterval) {
    return new SessionManage(expireInterval, cleanupInterval);
}

SessionManage.prototype.cleanup = function(sessions) {
    var curTime = new Date().getTime;
    for (var id in sessions) {
        var session = sessions[id];
        if (session.expiredTime < curTime) {
            delete sessions[id];
        }
    }
}

var getIdFromCookie = function(req) {
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(";").forEach(
        function(Cookie) {
            var parts = Cookie.split("=");
            Cookies[parts[0].trim()] = (parts[1] || '').trim();
        }        
    );
    console.info(Cookies);
    console.info(Cookies["D_SID"]);
    if (Cookies["D_SID"]) {
        return (Cookies["D_SID"])
    }
}

