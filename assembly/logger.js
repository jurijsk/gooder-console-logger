export var LoggerLevels;
(function (LoggerLevels) {
    LoggerLevels[LoggerLevels["Error"] = 0] = "Error";
    LoggerLevels[LoggerLevels["Warn"] = 1] = "Warn";
    LoggerLevels[LoggerLevels["Log"] = 2] = "Log";
    LoggerLevels[LoggerLevels["None"] = 3] = "None";
})(LoggerLevels || (LoggerLevels = {}));
class ConsoleLogger {
    constructor(level) {
        function dummy() { }
        let logFunction;
        let errorFunction;
        function setLevel(value) {
            level = value;
            logFunction = dummy;
            errorFunction = dummy;
            if (LoggerLevels.Error >= level) {
                errorFunction = console.error;
            }
            if (LoggerLevels.Log >= level) {
                logFunction = console.log;
            }
            publish();
        }
        let publish = (function () {
            this.error = errorFunction;
            this.log = logFunction;
            this.setLevel = setLevel;
        }).bind(this);
        setLevel(level);
    }
}
class LoggerMeta {
    constructor(type, level) {
        this.type = type;
        this.level = level;
    }
}
class LoggerProviderClass {
    constructor() {
        let defaultLevel = LoggerLevels.Log;
        let loggers = {};
        function setDefaultLevel(value) {
            defaultLevel = value;
        }
        function getLogger(caller) {
            let meta = loggers[caller];
            if (!meta) {
                meta = new LoggerMeta(caller);
                //not using one generic logger here because users can override level themselves.
                meta.logger = new ConsoleLogger(defaultLevel);
                loggers[caller] = meta;
            }
            if (!meta.logger) {
                meta.logger = new ConsoleLogger(meta.level);
            }
            return meta.logger;
        }
        function setLevel(caller, level) {
            let meta = loggers[caller];
            if (!meta) {
                meta = new LoggerMeta(caller, level);
                loggers[caller] = meta;
            }
            meta.level = level;
            if (meta.logger) {
                meta.logger.setLevel(level);
            }
        }
        this.setLevel = setLevel;
        this.getLogger = getLogger;
        this.setDefaultLevel = setDefaultLevel;
    }
}
export const LoggerProvider = new LoggerProviderClass();
