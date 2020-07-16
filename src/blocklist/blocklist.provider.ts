import { HttpService } from "@nestjs/common"

const { BLOCKLIST_URL } = process.env

export class BlocklistProvider {
  private static domains = new Set<string>()

  public static get providerName(): string {
    return "BLOCKLIST"
  }

  public static async init(httpService: HttpService): Promise<Set<string>> {
    const res = await httpService
      .get(BLOCKLIST_URL as string, { timeout: 10 * 1000 })
      .toPromise()
    if (res.status < 200 || res.status >= 300 || !res.data) {
      throw new Error(`Cannot fetch blocklist from ${BLOCKLIST_URL}`)
    }
    const hosts = res.data
    for (const line of hosts.split("\n")) {
      const l = line.trim()
      if (!l || l.startsWith("#")) {
        continue
      }
      const domain = l.split(" ")[1]
      BlocklistProvider.domains.add(domain)
    }
    return BlocklistProvider.domains
  }
}
