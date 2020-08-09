import { TargetType } from "./target-type.enum"

export class OutputTarget {
  cssSelector: string
  attribute?: string
  type: TargetType
  name?: string
  description?: string
  values: Array<string | number | null>
  multiple?: boolean = false
}
