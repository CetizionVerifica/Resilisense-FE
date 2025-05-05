export function getlevelOfImpact(max, min) {
  const avg = (max - min) / 3
  const level = [min, min + avg, max - avg, max]
  return level
}

export function between(x, min, max) {
  return x >= min && x <= max
}
