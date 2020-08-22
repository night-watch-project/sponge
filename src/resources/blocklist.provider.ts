import type { HttpService } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"

export class BlocklistProvider {
  private static blocklist = new Set<string>()

  public static get providerName(): string {
    return "BLOCKLIST"
  }

  public static async init(
    config: ConfigService,
    http: HttpService
  ): Promise<Set<string>> {
    const blocklistUrl = config.get<string>("BLOCKLIST_URL")

    if (!blocklistUrl) {
      return BlocklistProvider.blocklist
    }

    const res = await http.get(blocklistUrl).toPromise()
    if (res.status < 200 || res.status >= 300 || !res.data) {
      throw new Error(`Cannot fetch blocklist from ${blocklistUrl}`)
    }
    const hosts = res.data
    for (const line of hosts.split("\n")) {
      const l = line.trim()
      if (!l || l.startsWith("#")) {
        continue
      }
      const domain = l.split(" ")[1]
      BlocklistProvider.blocklist.add(domain)
    }
    return BlocklistProvider.blocklist
  }
}
