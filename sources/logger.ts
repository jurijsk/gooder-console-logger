export enum LoggerLevels {
	Error = 0,
	Warn = 1,
	Log = 2,
	None = 3,
}

interface ILogger {
	log: {(...data: any[]): void; (message?: any, ...optionalParams: any[]): void;};
	error: {(...data: any[]): void; (message?: any, ...optionalParams: any[]): void;};
	setLevel: (value: LoggerLevels) => void;
}

class ConsoleLogger {
	/**
	 * Sets the level of messages to output.
	 * 
	 * **Note** that if the instance is ontained via `getLogger()` call,
	 * the change of the level will affect the level of all clients of the logger 
	 * as it at is cached. 
	 */
	setLevel: (value: LoggerLevels) => void;
	error: {(...data: any[]): void; (message?: any, ...optionalParams: any[]): void;};
	log: {(...data: any[]): void; (message?: any, ...optionalParams: any[]): void;};
	constructor(level: LoggerLevels) {

		function dummy() { }

		let logFunction: {(...data: any[]): void; (message?: any, ...optionalParams: any[]): void;};
		let errorFunction: {(...data: any[]): void; (message?: any, ...optionalParams: any[]): void;};

		function setLevel(value: LoggerLevels) {
			level = value;
			logFunction = dummy;
			errorFunction = dummy;
			if(LoggerLevels.Error >= level) {
				errorFunction = console.error;
			}
			if(LoggerLevels.Log >= level) {
				logFunction = console.log;
			}
			publish();
		}

		let publish = (function(this: ConsoleLogger) {
			this.error = errorFunction;
			this.log = logFunction;
			this.setLevel = setLevel;
		}).bind(this);
		setLevel(level);
	}
}

class LoggerMeta<T> {
	constructor(public type: T, public level?: LoggerLevels) { }
	public logger: ILogger;
}

class LoggerProviderClass {
	/**
	 * Sets the level of messages to output for the specified type/class.
	 */
	setLevel: <T>(caller: T, level: LoggerLevels) => void;
	
	/**
	 * Instanciates or returns cached logger for the `caller` type/class.
	 */
	getLogger: <T>(caller: T) => ILogger;
	setDefaultLevel: (value: LoggerLevels) => void;
	constructor() {
		let defaultLevel = LoggerLevels.Log;
		let loggers: any = {};

		function setDefaultLevel(value: LoggerLevels) {
			defaultLevel = value;
		}

		function getLogger<T>(caller: T) {
			let meta = loggers[caller] as LoggerMeta<T>;
			if(!meta) {
				meta = new LoggerMeta(caller);
				//not using one generic logger here because users can override level themselves.
				meta.logger = new ConsoleLogger(defaultLevel);
				loggers[caller] = meta;
			} if(!meta.logger) {
				meta.logger = new ConsoleLogger(meta.level);
			}
			return meta.logger;
		}

		function setLevel<T>(caller: T, level: LoggerLevels) {
			let meta = loggers[caller] as LoggerMeta<T>;
			if(!meta) {
				meta = new LoggerMeta(caller, level);
				loggers[caller] = meta;
			}
			meta.level = level;
			if(meta.logger) {
				meta.logger.setLevel(level);
			}

		}
		this.setLevel = setLevel;
		this.getLogger = getLogger;
		this.setDefaultLevel = setDefaultLevel;
	}
}
export const LoggerProvider = new LoggerProviderClass();
