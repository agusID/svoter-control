export function mixcls(mix) {
  let k
  let y
  let str = ''
  if (mix) {
    if (typeof mix === 'object') {
      if (!!mix.push) {
        for (k = 0; k < mix.length; k++) {
          if (mix[k] && (y = mixcls(mix[k]))) {
            str && (str += ' ')
            str += y
          }
        }
      } else for (k in mix) if (mix[k] && (y = mixcls(k))) str += y
    } else if (typeof mix !== 'boolean' && !mix.call) str += mix
  }
  return str
}
