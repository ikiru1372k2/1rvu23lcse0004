// logging-middleware.js
// Fixed version - no reserved words

class LoggingMiddleware {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.apiUrl = 'http://20.244.56.144/evaluation-service/logs';
  }

  // Main logging function - fixed parameter name
  async Log(stack, level, packageName, message) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          stack: stack.toLowerCase(),
          level: level.toLowerCase(),
          package: packageName.toLowerCase(),
          message: message
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(` Log sent: [${level.toUpperCase()}] ${message}`);
        return result;
      } else {
        const errorText = await response.text();
        console.error(`Failed to send log (${response.status}):`, errorText);
        return { error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error(' Logging error:', error.message);
      return { error: error.message };
    }
  }

  // Simple convenience methods
  async debug(stack, packageName, message) {
    return this.Log(stack, 'debug', packageName, message);
  }

  async info(stack, packageName, message) {
    return this.Log(stack, 'info', packageName, message);
  }

  async warn(stack, packageName, message) {
    return this.Log(stack, 'warn', packageName, message);
  }

  async error(stack, packageName, message) {
    return this.Log(stack, 'error', packageName, message);
  }

  async fatal(stack, packageName, message) {
    return this.Log(stack, 'fatal', packageName, message);
  }
}

module.exports = LoggingMiddleware;