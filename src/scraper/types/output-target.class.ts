import { TargetType } from "./target-type.enum"

export class OutputTarget {
  cssSelector: string
  type: TargetType
  value: string | number | null
  name?: string
  description?: string
}
