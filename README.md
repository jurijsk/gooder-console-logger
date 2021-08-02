# gooder-console-logger
Same as browser console but gooder. Configure message log levels (log, errors, mute) for individual classes or for the whole project.


# Benefits

 * **Does not break console.log() experince.** That link which lands you to the file and line where the call was made. It is still there, unlike other loggers with land you to their internal source file.
 * **Configurable.** Mute the logger or set log level for entire project or individual classes.




# Drawback

 * **Incomplete at the moment.** Only `console.log` and `concole.error` are implemented are the moment. 

# Todo
 * Implement the rest of the console methods.
 * Implement diversion of the messages if loger is set to mute certain type or origin of messages. Unfortunately it can me only one (output to console) or another (output someplace else, e.g api call). 
 * Implement custom logging functions for specific classes/types. 