import { type ReactElement } from 'react'
import { InputAdornment, Typography } from '@mui/material'
import EthHashInfo from '@/components/common/EthHashInfo'
import css from './styles.module.css'

const AddressInputReadOnly = ({ address }: { address: string }): ReactElement => {
  return (
    <div className={css.input} data-testid="address-book-recipient">
      <InputAdornment position="start">
        <Typography variant="body2" component="div" width={1}>
          <EthHashInfo address={address} shortAddress={false} copyAddress={false} />
        </Typography>
      </InputAdornment>
    </div>
  )
}

export default AddressInputReadOnly
