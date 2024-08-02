import { useEffect, type ReactElement } from 'react'
import classnames from 'classnames'
import type { CheckboxProps } from '@mui/material'
import { Grid, Button, Checkbox, FormControlLabel, Typography, Paper, SvgIcon, Box } from '@mui/material'
import WarningIcon from '@/public/images/notifications/warning.svg'
import { useForm } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '@/store'
import { selectCookies, CookieAndTermType, saveCookieAndTermConsent } from '@/store/cookiesAndTermsSlice'
import { selectCookieBanner, openCookieBanner, closeCookieBanner } from '@/store/popupSlice'

import css from './styles.module.css'
import { AppRoutes } from '@/config/routes'
import ExternalLink from '../ExternalLink'

const COOKIE_AND_TERM_WARNING: Record<CookieAndTermType, string> = {
  [CookieAndTermType.TERMS]: '',
  [CookieAndTermType.NECESSARY]: '',
  [CookieAndTermType.UPDATES]: `You attempted to open the "What's new" section but need to accept the "Beamer" cookies first.`,
  [CookieAndTermType.ANALYTICS]: '',
}

const CookieCheckbox = ({
  checkboxProps,
  label,
  checked,
}: {
  label: string
  checked: boolean
  checkboxProps: CheckboxProps
}) => <FormControlLabel label={label} checked={checked} control={<Checkbox {...checkboxProps} />} sx={{ mt: '-9px' }} />

export const CookieAndTermBanner = ({
  warningKey,
  inverted,
}: {
  warningKey?: CookieAndTermType
  inverted?: boolean
}): ReactElement => {
  const warning = warningKey ? COOKIE_AND_TERM_WARNING[warningKey] : undefined
  const dispatch = useAppDispatch()
  const cookies = useAppSelector(selectCookies)

  const { register, watch, getValues, setValue } = useForm({
    defaultValues: {
      [CookieAndTermType.TERMS]: true,
      [CookieAndTermType.NECESSARY]: true,
      [CookieAndTermType.UPDATES]: cookies[CookieAndTermType.UPDATES] ?? false,
      [CookieAndTermType.ANALYTICS]: cookies[CookieAndTermType.ANALYTICS] ?? false,
      ...(warningKey ? { [warningKey]: true } : {}),
    },
  })

  const handleAccept = () => {
    dispatch(saveCookieAndTermConsent(getValues()))
    dispatch(closeCookieBanner())
  }

  const handleAcceptAll = () => {
    setValue(CookieAndTermType.UPDATES, true)
    setValue(CookieAndTermType.ANALYTICS, true)
    setTimeout(handleAccept, 300)
  }

  return (
    <Paper className={classnames(css.container, { [css.inverted]: inverted })}>
      {warning && (
        <Typography align="center" mb={2} color="warning.background" variant="body2">
          <SvgIcon component={WarningIcon} inheritViewBox fontSize="small" color="error" sx={{ mb: -0.4 }} /> {warning}
        </Typography>
      )}

      <form>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="body2" mb={2}>
              By browsing this page, you accept our Terms & Conditions (last updated July 2024) and the use of necessary
              cookies. By clicking &quot;Accept all&quot; you additionally agree to the use of Beamer and Analytics
              cookies as listed below. Cookie policy
            </Typography>

            <Grid container alignItems="center" gap={4}>
              <Grid item xs={12} sm>
                <Box mb={2}>
                  <CookieCheckbox checkboxProps={{ id: 'necessary', disabled: true }} label="Necessary" checked />
                  <br />
                  <Typography variant="body2">Locally stored data for core functionality</Typography>
                </Box>

                {/* <Box mb={2}>
                  <CookieCheckbox
                    checkboxProps={{ ...register(CookieAndTermType.UPDATES), id: 'beamer' }}
                    label="Beamer"
                    checked={watch(CookieAndTermType.UPDATES)}
                  />
                  <br />
                  <Typography variant="body2">New features and product announcements</Typography>
                </Box>

                <Box>
                  <CookieCheckbox
                    checkboxProps={{ ...register(CookieAndTermType.ANALYTICS), id: 'ga' }}
                    label="Analytics"
                    checked={watch(CookieAndTermType.ANALYTICS)}
                  />
                  <br />
                  <Typography variant="body2">
                    Opt in for Google Analytics cookies to help us analyze app usage patterns.
                  </Typography>
                </Box> */}
              </Grid>
            </Grid>

            <Grid container alignItems="center" justifyContent="center" mt={4} gap={2}>
              <Grid item>
                <Typography>
                  <Button onClick={handleAccept} variant="text" size="small" color="inherit" disableElevation>
                    Save settings
                  </Button>
                </Typography>
              </Grid>

              <Grid item>
                <Button onClick={handleAcceptAll} variant="contained" color="secondary" size="small" disableElevation>
                  Accept all
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

const CookieBannerPopup = (): ReactElement | null => {
  const cookiePopup = useAppSelector(selectCookieBanner)
  const cookies = useAppSelector(selectCookies)
  const dispatch = useAppDispatch()

  // Open the banner if cookie preferences haven't been set
  const shouldOpen = cookies[CookieAndTermType.NECESSARY] === undefined

  useEffect(() => {
    if (shouldOpen) {
      dispatch(openCookieBanner({}))
    } else {
      dispatch(closeCookieBanner())
    }
  }, [dispatch, shouldOpen])

  return cookiePopup?.open ? (
    <div className={css.popup}>
      <CookieAndTermBanner warningKey={cookiePopup.warningKey} inverted />
    </div>
  ) : null
}

export default CookieBannerPopup
