function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateNumber(length: number) {
  let num = ""
  for (let i = 0; i < length; i++) {
    num += random(0, 9)
  }
  return num
}
