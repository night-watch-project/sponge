import { UserAgentEntity } from "./user-agent.interface"

export class UserAgentPool {
    constructor(private readonly entities: UserAgentEntity[] = []) {}

    public random(): string {
        const idx = Math.floor(Math.random() * this.entities.length)
        return this.entities[idx].userAgent
    }

    public extend(entities: UserAgentEntity[]) {
        this.entities.push(...entities)
    }
}
