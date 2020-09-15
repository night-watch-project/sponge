import { UserAgentEntity } from "./user-agent.interface"

export class UserAgentPool {
    constructor(private readonly entities: UserAgentEntity[] = []) {}

    /*
     * Pick a random user-agent, or return undefined if the pool is empty
     */
    public random(): string | undefined {
        if (!this.entities.length) {
            return undefined
        }

        const idx = Math.floor(Math.random() * this.entities.length)
        return this.entities[idx].userAgent
    }

    public extend(entities: UserAgentEntity[]): void {
        this.entities.push(...entities)
    }
}
