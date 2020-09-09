export class UserAgentPool {
    constructor(private readonly userAgents: Record<string, unknown>[] = []) {}

    extend(userAgents: Record<string, unknown>[]) {
        this.userAgents.push(...userAgents)
    }
}
