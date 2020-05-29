const { HeadlessBrowser } = require("../lib/headless-browser")

const browser = new HeadlessBrowser()

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      res.status(200).json({ iam: "/api/scraper" })
    } else if (req.method === "POST") {
      const { url, targets } = req.body
      const resultTargets = await browser.scrape(url, targets)
      res.status(200).json({ targets: resultTargets })
    } else {
      res.status(405).json({})
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({})
  }
}
