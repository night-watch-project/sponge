import { RateLimiterMemory } from "rate-limiter-flexible"

export class RateLimiter {
  static points = 60
  static duration = 60 * 60 // 3600s == 1h
  static limiter = new RateLimiterMemory({
    points: RateLimiter.points,
    duration: RateLimiter.duration,
  })

  static async consumeRequest(req) {
    const clientAddr =
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      null

    return RateLimiter.limiter.consume(clientAddr, 1)
  }
}
