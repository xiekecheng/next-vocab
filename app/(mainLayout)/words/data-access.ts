export async function getWords(params: any) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`/api/words?${qs}`)
  return res.json()
} 