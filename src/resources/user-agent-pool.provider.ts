import type { HttpService } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import { UserAgentPool } from "./types/user-agent-pool.class"
import { UserAgentEntity } from "./types/user-agent.interface"

export class UserAgentPoolProvider {
    private static pool = new UserAgentPool()

    public static get providerName(): string {
        return "USER_AGENT_POOL"
    }

    public static async init(
        config: ConfigService,
        http: HttpService
    ): Promise<UserAgentPool> {
        const url = config.get<string>("USER_AGENT_POOL_URL")

        if (!url) {
            return UserAgentPoolProvider.pool
        }

        const res = await http.get<UserAgentEntity[]>(url).toPromise()
        if (res.status < 200 || res.status >= 300 || !res.data) {
            throw new Error(`Cannot fetch user-agents from ${url}`)
        }
        UserAgentPoolProvider.pool.extend(res.data)

        return UserAgentPoolProvider.pool
    }
}
