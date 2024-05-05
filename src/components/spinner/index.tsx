// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { Modal, ModalProps } from '@mui/material'

//Componets
import CircularWithValueLabel from '../custom-circular-process'

const CustomModal = styled(Modal)<ModalProps>(({ theme }) => ({
  '&.MuiModal-root': {
    with: '100%',
    height: '100%',
    zIndex: 2000,
    '.MuiModal-backdrop': {
      backgroundColor: `rgba(${theme.palette.customColors.main}, 0.2)`
    }
  }
}))

const Spinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme()

  return (
    <CustomModal open={true}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <CircularWithValueLabel />
      </Box>
    </CustomModal>
  )
}

export default Spinner
