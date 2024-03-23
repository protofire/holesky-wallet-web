import { type ReactElement } from 'react'
import useAllAddressBooks from '@/hooks/useAllAddressBooks'
import useChainId from '@/hooks/useChainId'
import { useAppSelector } from '@/store'
import { selectSettings } from '@/store/settingsSlice'
import { selectChainById } from '@/store/chainsSlice'
import { getBlockExplorerLink } from '@/utils/chains'
import SrcEthHashInfo, { type EthHashInfoProps } from './SrcEthHashInfo'

const EthHashInfo = ({
  showName = true,
  avatarSize = 40,
  ...props
}: EthHashInfoProps & { showName?: boolean }): ReactElement => {
  const settings = useAppSelector(selectSettings)
  const currentChainId = useChainId()
  const chain = useAppSelector((state) => selectChainById(state, props.chainId || currentChainId))
  const addressBooks = useAllAddressBooks()
  const link = chain && props.hasExplorer ? getBlockExplorerLink(chain, props.address) : undefined
  const name = showName && chain ? addressBooks?.[chain.chainId]?.[props.address] || props.name : undefined

  return (
    <SrcEthHashInfo
      prefix={chain?.shortName}
      copyPrefix={settings.shortName.copy}
      {...props}
      name={name}
      customAvatar={props.customAvatar}
      ExplorerButtonProps={{ title: link?.title || '', href: link?.href || '' }}
      avatarSize={avatarSize}
    >
      {props.children}
    </SrcEthHashInfo>
  )
}

export default EthHashInfo
