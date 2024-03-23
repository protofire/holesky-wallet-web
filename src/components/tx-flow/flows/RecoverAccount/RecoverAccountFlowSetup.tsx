import {
  Typography,
  Divider,
  CardActions,
  Button,
  SvgIcon,
  Grid,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material'
import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form'
import { Fragment } from 'react'
import type { ReactElement } from 'react'

import TxCard from '../../common/TxCard'
import AddIcon from '@/public/images/common/add.svg'
import DeleteIcon from '@/public/images/common/delete.svg'
import { RecoverAccountFlowFields } from '.'
import AddressBookInput from '@/components/common/AddressBookInput'
import { TOOLTIP_TITLES } from '../../common/constants'
import InfoIcon from '@/public/images/notifications/info.svg'
import useSafeInfo from '@/hooks/useSafeInfo'
import { sameAddress } from '@/utils/addresses'
import type { RecoverAccountFlowProps } from '.'
import type { AddressEx } from '@safe-global/safe-gateway-typescript-sdk'

import commonCss from '@/components/tx-flow/common/styles.module.css'

export function _isSameSetup({
  oldOwners,
  oldThreshold,
  newOwners,
  newThreshold,
}: {
  oldOwners: Array<AddressEx>
  oldThreshold: number
  newOwners: Array<AddressEx>
  newThreshold: number
}): boolean {
  if (oldThreshold !== newThreshold) {
    return false
  }

  if (oldOwners.length !== newOwners.length) {
    return false
  }

  return oldOwners.every((oldOwner) => {
    return newOwners.some((newOwner) => sameAddress(oldOwner.value, newOwner.value))
  })
}

export function RecoverAccountFlowSetup({
  params,
  onSubmit,
}: {
  params: RecoverAccountFlowProps
  onSubmit: (formData: RecoverAccountFlowProps) => void
}): ReactElement {
  const { safeAddress, safe } = useSafeInfo()

  const formMethods = useForm<RecoverAccountFlowProps>({
    defaultValues: params,
    mode: 'onChange',
  })

  const newOwners = formMethods.watch(RecoverAccountFlowFields.owners)
  const newThreshold = formMethods.watch(RecoverAccountFlowFields.threshold)

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: RecoverAccountFlowFields.owners,
  })

  const isSameSetup = _isSameSetup({
    oldOwners: safe.owners,
    oldThreshold: safe.threshold,
    newOwners,
    newThreshold: Number(newThreshold),
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className={commonCss.form}>
        <TxCard>
          <div>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Add signer(s)
            </Typography>

            <Typography variant="body2" mb={1}>
              Set the new signer wallet(s) of this Safe Account and how many need to confirm a transaction before it can
              be executed.
            </Typography>
          </div>

          <Grid container spacing={3} direction="row">
            {fields.map((field, index) => (
              <Fragment key={index}>
                <Grid item xs={11}>
                  <AddressBookInput
                    label={`Signer ${index + 1}`}
                    name={`${RecoverAccountFlowFields.owners}.${index}.value`}
                    required
                    fullWidth
                    key={field.id}
                    validate={(value) => {
                      if (sameAddress(value, safeAddress)) {
                        return 'The Safe Account cannot own itself'
                      }

                      const isDuplicate = newOwners.filter((owner) => owner.value === value).length > 1
                      if (isDuplicate) {
                        return 'Already designated to be a signer'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={1} display="flex" alignItems="center" justifyContent="center">
                  {index > 0 && (
                    <IconButton onClick={() => remove(index)}>
                      <SvgIcon component={DeleteIcon} inheritViewBox />
                    </IconButton>
                  )}
                </Grid>
              </Fragment>
            ))}
          </Grid>

          <Button
            onClick={() => append({ value: '' })}
            variant="text"
            startIcon={<SvgIcon component={AddIcon} inheritViewBox fontSize="small" />}
            sx={{ alignSelf: 'flex-start', my: 1 }}
          >
            Add new signer
          </Button>

          <Divider className={commonCss.nestedDivider} />

          <div>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Threshold
              <Tooltip title={TOOLTIP_TITLES.THRESHOLD} arrow placement="top">
                <span>
                  <SvgIcon
                    component={InfoIcon}
                    inheritViewBox
                    color="border"
                    fontSize="small"
                    sx={{
                      verticalAlign: 'middle',
                      ml: 0.5,
                    }}
                  />
                </span>
              </Tooltip>
            </Typography>

            <Typography variant="body2" mb={1}>
              After recovery, Safe Account transactions will require:
            </Typography>
          </div>

          <Grid container direction="row" alignItems="center" gap={2} mb={1}>
            <Grid item>
              <Controller
                control={formMethods.control}
                name={RecoverAccountFlowFields.threshold}
                render={({ field }) => (
                  <TextField select {...field}>
                    {fields.map((_, index) => {
                      const value = index + 1
                      return (
                        <MenuItem key={index} value={value}>
                          {value}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item>
              <Typography>out of {fields.length} signer(s)</Typography>
            </Grid>
          </Grid>

          {isSameSetup && (
            <Alert severity="error" sx={{ border: 'unset' }}>
              The proposed Account setup is the same as the current one.
            </Alert>
          )}

          <Divider className={commonCss.nestedDivider} />

          <CardActions sx={{ mt: '0 !important' }}>
            <Button data-testid="next-btn" variant="contained" type="submit" sx={{ mt: 1 }} disabled={isSameSetup}>
              Next
            </Button>
          </CardActions>
        </TxCard>
      </form>
    </FormProvider>
  )
}
