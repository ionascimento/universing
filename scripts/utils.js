function randomNumber(min, max, floatPoints=0) {
  let number = min + Math.random() * max

  if(floatPoints == 0) return Math.trunc(number)
  return Number(number.toPrecision(floatPoints + 1))
}