export declare enum LoggerLevels {
    Error = 0,
    Warn = 1,
    Log = 2,
    None = 3
}
interface ILogger {
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    error: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    setLevel: (value: LoggerLevels) => void;
}
declare class LoggerProviderClass {
    setLevel: <T>(caller: T, level: LoggerLevels) => void;
    getLogger: <T>(caller: T) => ILogger;
    setDefaultLevel: (value: LoggerLevels) => void;
    constructor();
}
export declare const LoggerProvider: LoggerProviderClass;
export {};
