import { TargetType } from "./target-type.enum"

export class InputTarget {
  name?: string
  description?: string
  cssSelector: string
  attribute?: string
  type?: TargetType = TargetType.String
  multiple?: boolean = false
}
