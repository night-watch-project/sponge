const { RateLimiterMemory } = require("rate-limiter-flexible")

module.exports.RateLimiter = class RateLimiter {
  static points = 60
  static duration = 60 * 60 // seconds
  static limiter = new RateLimiterMemory({
    points: RateLimiter.points,
    duration: RateLimiter.duration,
  })

  static async consume(req) {
    const clientAddr =
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      null

    return RateLimiter.limiter.consume(clientAddr, 1)
  }
}
