import { TargetType } from "./target-type.enum"

export class InputTarget {
  cssSelector: string
  type?: TargetType = TargetType.String
  name?: string
  description?: string
}
