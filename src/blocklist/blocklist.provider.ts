import { HttpService } from "@nestjs/common"

export class BlocklistProvider {
  private static blocklist = new Set<string>()

  public static get providerName(): string {
    return "BLOCKLIST"
  }

  public static async init(httpService: HttpService): Promise<Set<string>> {
    // cannot put this line at the head of the file as env vars won't be fully populated
    const { BLOCKLIST_URL } = process.env

    const res = await httpService.get(BLOCKLIST_URL as string).toPromise()
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
      BlocklistProvider.blocklist.add(domain)
    }
    return BlocklistProvider.blocklist
  }
}
