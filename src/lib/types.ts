export interface InputTarget {
  cssSelector: string
  type?: "string" | "number"
}

export interface OutputTarget {
  cssSelector: string
  type: "string" | "number"
  value: string | number | null
}
