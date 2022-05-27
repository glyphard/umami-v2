import React from 'react'
import { ethers } from 'ethers'
import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '../abis/IUniswapV3Pool.abi'
import { useQuery, useQueryClient } from 'react-query'
import { useNotifications } from 'reapop'

import { useInfuraProvider } from './useInfuraProvider'
import { POOL_ADDRESSES, ARBITRUM_ID } from '../constants'

const arbitrumId = ARBITRUM_ID

export function useUmamiPrice() {
  const { notify } = useNotifications()

  const provider = useInfuraProvider()

  const getUmamiEthPrice = React.useCallback(async () => {
    try {
      if (!provider) {
        throw new Error('No provider')
      }

      const poolContract = new ethers.Contract(
        POOL_ADDRESSES.umamiEth,
        IUniswapV3PoolABI,
        provider
      )

      const [token0, token1, fee, slot, liquidiy] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.slot0(),
        poolContract.liquidity(),
      ])

      const UmamiToken = new Token(arbitrumId, token0, 9)
      const WethToken = new Token(arbitrumId, token1, 18)

      const [sqrtPriceX96, tick] = slot

      const pool = new Pool(
        UmamiToken,
        WethToken,
        fee,
        sqrtPriceX96.toString(),
        liquidiy.toString(),
        tick
      )

      return pool.token0Price
    } catch (err) {
      console.log(err)
      notify('Problem fetching UMAMI/ETH pool info', 'error')
    }
  }, [notify, provider])

  const getEthUsdcPrice = React.useCallback(async () => {
    try {
      if (!provider) {
        throw new Error('No provider')
      }

      const poolContract = new ethers.Contract(
        POOL_ADDRESSES.ethUsdc,
        IUniswapV3PoolABI,
        provider
      )

      const [token0, token1, fee, slot, liquidiy] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.slot0(),
        poolContract.liquidity(),
      ])

      const WethToken = new Token(arbitrumId, token0, 18)
      const UsdcToken = new Token(arbitrumId, token1, 6)

      const [sqrtPriceX96, tick] = slot

      const pool = new Pool(
        WethToken,
        UsdcToken,
        fee,
        sqrtPriceX96.toString(),
        liquidiy.toString(),
        tick
      )

      return pool.token1Price
    } catch (err) {
      console.log(err)
      notify('Problem fetching UMAMI/ETH pool info', 'error')
    }
  }, [notify, provider])

  const getUmamiUsdPrice = React.useCallback(async () => {
    try {
      const [umamiPrice, wethPrice] = await Promise.all([
        getUmamiEthPrice(),
        getEthUsdcPrice(),
      ])

      if (!umamiPrice || !wethPrice) {
        throw new Error('UMAMI/ETH price or ETH/USDC price not available')
      }

      const price =
        Number(umamiPrice?.toFixed(9)) / Number(wethPrice?.toFixed(9))

      return price
    } catch (err) {
      console.log(err)
      notify('Problem computing UMAMI/USDC price', 'error')
    }
  }, [getUmamiEthPrice, getEthUsdcPrice, notify])

  const queryClient = useQueryClient()

  return useQuery('umamiPrice', getUmamiUsdPrice, {
    initialData: queryClient.getQueryData('umamiPrice') ?? null,
  })
}