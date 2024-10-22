import Typography from '@mui/material/Typography'
import PagePlaceholder from '@/components/common/PagePlaceholder'
import AddCustomAppIcon from '@/public/images/apps/add-custom-app.svg'

const SafeAppsZeroResultsPlaceholder = ({ searchQuery }: { searchQuery: string }) => {
  return (
    <PagePlaceholder
      img={<AddCustomAppIcon />}
      text={
        <Typography variant="body1" color="primary.light" m={2} maxWidth="600px">
          No Safe Apps found matching <strong>{searchQuery}</strong>. Connect to dApps that haven&apos;t yet been
          integrated with the {'Holesky Safe'} using WalletConnect.
        </Typography>
      }
    />
  )
}

export default SafeAppsZeroResultsPlaceholder
