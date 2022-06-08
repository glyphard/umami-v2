import React from 'react'
import { useQuery } from 'react-query'
import { useAccount } from 'wagmi'
import { useNotifications } from 'reapop'
import { ethers } from 'ethers'

import { useIsArbitrum } from './useIsArbitrum'
import { useContracts } from './useContracts'

export function useBalances() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()

  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const initialData = React.useMemo(() => {
    return {
      umami: 0,
      mumami: 0,
      cmumami: 0,
    }
  }, [])

  const fetchBalances = React.useCallback(async () => {
    try {
      const address = account?.address
      const [umamiBalance, mumamiBalance, cmumamiBalance] = await Promise.all([
        contracts.umami.balanceOf(address),
        contracts.mumami.balanceOf(address),
        contracts.cmumami.balanceOf(address),
      ])

      return {
        umami: Number(ethers.utils.formatUnits(umamiBalance, 9)),
        mumami: Number(ethers.utils.formatUnits(mumamiBalance, 9)),
        cmumami: Number(ethers.utils.formatUnits(cmumamiBalance, 9)),
      }
    } catch (err) {
      console.log(err)
      notify('Unable to fetch token balances', 'error')
      return initialData
    }
  }, [contracts, initialData, account, notify])

  return useQuery('balances', fetchBalances, {
    initialData,
    enabled: !!account && isArbitrum,
  })
}
