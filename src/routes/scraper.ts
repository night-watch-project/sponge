import { HeadlessBrowser } from "../lib/headless-browser"
import type { InputTarget, OutputTarget } from "../lib/types"

export default async (
  url: string,
  targets: InputTarget[] = []
): Promise<{ targets: OutputTarget[] }> => {
  const outputTargets = await HeadlessBrowser.scrape(url, targets)
  return { targets: outputTargets }
}
