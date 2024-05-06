//Next
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

//MUI
import { Box, Button, CssBaseline, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'

//Components
import CustomTextField from 'src/components/text-field'
import IconifyIcon from 'src/components/Icon'
import FallbackSpinner from 'src/components/fall-back'

//Form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

//Configs
import { PASSWORD_REG } from 'src/configs/regex'
import { ROUTE_CONFIG } from 'src/configs/route'

//React
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

//Image
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

//Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/apps/auth'
import { changePasswordMeAsync } from 'src/stores/apps/auth/actions'

//Hooks
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}

const ChangePasswordPage: NextPage<TProps> = () => {
  //State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  //Redux
  const dispatch: AppDispatch = useDispatch()

  const { messageChangePassword, isErrorChangePassword, isSuccessChangePassword, isLoading } = useSelector(
    (state: RootState) => state.auth
  )

  //Auth
  const { logout } = useAuth()

  //Route
  const route = useRouter()

  //Translate
  const { t } = useTranslation()

  //Theme
  const theme = useTheme()

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The password is contain charactor, special charactor, number'),

    newPassword: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The new password is contain charactor, special charactor, number'),

    confirmNewPassword: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The confirm new password is contain charactor, special charactor, number')
      .oneOf([yup.ref('newPassword'), ''], 'The confirm new password is must match with password')
  })

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: { currentPassword: string; newPassword: string }) => {
    if (!Object.keys(errors).length) {
      dispatch(changePasswordMeAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword }))
    }
  }

  useEffect(() => {
    if (messageChangePassword) {
      if (isErrorChangePassword) {
        toast.error(messageChangePassword)
      } else if (isSuccessChangePassword) {
        toast.success(messageChangePassword)
        setTimeout(() => {
          logout()
        }, 500)
      }

      dispatch(resetInitialState())
    }
  }, [isSuccessChangePassword, isErrorChangePassword, messageChangePassword])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '40px'
        }}
      >
        <Box
          display={{
            sm: 'flex',
            xs: 'none'
          }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            backgroundColor: theme.palette.customColors.bodyBg,
            height: '100%',
            minWidth: '50vw'
          }}
        >
          <Image
            src={theme.palette.mode === 'light' ? RegisterLight : RegisterDark}
            alt='login image'
            style={{
              height: 'auto',
              width: 'auto'
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              {t('Change_password')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
              <Box sx={{ mt: 2, width: '300px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Current_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      type={showCurrentPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                              {showCurrentPassword ? (
                                <IconifyIcon icon='material-symbols:visibility-outline' />
                              ) : (
                                <IconifyIcon icon='material-symbols:visibility-off-outline' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      placeholder={t('Enter_current_password')}
                      error={Boolean(errors?.currentPassword)}
                      helperText={errors?.currentPassword?.message}
                    />
                  )}
                  name='currentPassword'
                />
              </Box>

              <Box sx={{ mt: 2, width: '300px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('New_password')}
                      placeholder={t('Enter_new_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      type={showNewPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowNewPassword(!showNewPassword)}>
                              {showNewPassword ? (
                                <IconifyIcon icon='material-symbols:visibility-outline' />
                              ) : (
                                <IconifyIcon icon='material-symbols:visibility-off-outline' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(errors?.newPassword)}
                      helperText={errors?.newPassword?.message}
                    />
                  )}
                  name='newPassword'
                />
              </Box>

              <Box sx={{ mt: 2, width: '300px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Confirm_new_password')}
                      placeholder={t('Enter_confirm_new_password')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                              {showConfirmNewPassword ? (
                                <IconifyIcon icon='material-symbols:visibility-outline' />
                              ) : (
                                <IconifyIcon icon='material-symbols:visibility-off-outline' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(errors?.confirmNewPassword)}
                      helperText={errors?.confirmNewPassword?.message}
                    />
                  )}
                  name='confirmNewPassword'
                />
              </Box>

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                {t('Change')}
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ChangePasswordPage
