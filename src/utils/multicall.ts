import Web3 from 'web3'
import { Interface } from '@ethersproject/abi'
import { getProvider } from 'utils/getProvider'
// import { getMulticallContract } from 'utils/contractHelpers'
import { useMulticallContract } from 'hooks'
import multiCallAbi from 'abis/Multicall.json'
import { getContract, getMulticallAddress } from 'utils'
import { Contract } from '@ethersproject/contracts'

interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

interface MulticallOptions {
  web3?: Web3
  blockNumber?: number
  requireSuccess?: boolean
}

const Multicall = async (
  abi: any[],
  calls: Call[],
  options: MulticallOptions = {}
) => {
  const _web3 = getProvider(5)

  console.log('provider', _web3)
  try {
    // const multi: any = useMulticallContract()
    // const multi: any = getContract(getMulticallAddress(5), multiCallAbi)
    const multi: any = new Contract(
      '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
      multiCallAbi
    )

    const itf = new Interface(abi)

    const calldata = calls.map((call) => [
      call?.address?.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ])

    const { returnData } = await multi
      .aggregate(calldata)
      .call(undefined, options.blockNumber)
    const res = returnData.map((call, i) =>
      itf.decodeFunctionResult(calls[i].name, call)
    )

    return res
  } catch (error: any) {
    console.error(error)
    throw new Error(error)
  }
}

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return inclues a boolean whether the call was successful e.g. [wasSuccessfull, callResult]
 */
// export const multicallv2 = async (
//   abi: any[],
//   calls: Call[],
//   options: MulticallOptions = {}
// ) => {
//   const multi = getMulticallContract(options.web3 || web3NoAccount)
//   const itf = new Interface(abi)

//   const calldata = calls.map((call) => [
//     call.address.toLowerCase(),
//     itf.encodeFunctionData(call.name, call.params),
//   ])
//   const returnData = await multi.methods
//     .tryAggregate(
//       options.requireSuccess === undefined ? true : options.requireSuccess,
//       calldata
//     )
//     .call(undefined, options.blockNumber)
//   const res = returnData.map((call, i) => {
//     const [result, data] = call
//     return {
//       result,
//       data: itf.decodeFunctionResult(calls[i].name, data),
//     }
//   })

//   return res
// }
export default Multicall
