import { recoverMessageAddress } from "viem";

const WHITELIST = [
  "0x50e70c43a5DD812e2309eAcea61348041011b4BA",
]

export const approvedAddress = async (message: string, signature: `0x${string}`) => {
  try {
    const address = await recoverMessageAddress({ message, signature });
    console.log("Approved address:", address);
    if (WHITELIST.includes(address)) return true;
    return false;
  } catch (e) {
    return Promise.reject(e);
  }  
};