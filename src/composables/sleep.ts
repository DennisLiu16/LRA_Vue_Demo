const sleep = (ms: number)=> {
  return new Promise(resolve=>setTimeout(resolve, ms))
}

export const delay = async(ms:number) => {
  await sleep(ms);
} 