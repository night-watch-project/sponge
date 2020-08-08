import { TargetType } from "./target-type.enum"
import { TargetItem } from "./target-item.class"

export class OutputTarget {
  cssSelector: string
  attribute?: string
  type: TargetType
  name?: string
  description?: string
  values?: TargetItem[]
}
