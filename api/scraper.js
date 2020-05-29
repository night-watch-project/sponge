const { HeadlessBrowser } = require("../lib/headless-browser")
const { RateLimiter } = require("../lib/rate-limiter")

module.exports = async (req, res) => {
  try {
    await RateLimiter.consume(req)
  } catch {
    return res.status(429).json({})
  }

  try {
    if (req.method === "GET") {
      return res.status(200).json({ iam: "/api/scraper" })
    } else if (req.method === "POST") {
      const { url, targets } = req.body
      const resultTargets = await HeadlessBrowser.scrape(url, targets)
      return res.status(200).json({ targets: resultTargets })
    } else {
      return res.status(405).json({})
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({})
  }
}
