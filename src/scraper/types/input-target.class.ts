import { TargetType } from "./target-type.enum"

export class InputTarget {
  cssSelector: string
  attribute?: string
  type?: TargetType = TargetType.String
  name?: string
  description?: string
}
