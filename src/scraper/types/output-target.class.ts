import { TargetType } from "./target-type.enum"
import { TargetItem } from "./target-item.class"

export class OutputTarget {
  cssSelector: string
  attribute?: string
  type: TargetType
  value?: string | number | null
  name?: string
  description?: string
  targets?: TargetItem[]
}
