//Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
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
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { ROUTE_CONFIG } from 'src/configs/route'

//React
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

//Image
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

//Redux
import { useDispatch, useSelector } from 'react-redux'
import { registerAuthAsync } from 'src/stores/apps/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/apps/auth'

type TProps = {}

const RegisterPage: NextPage<TProps> = () => {
  //State
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  //Redux
  const dispatch: AppDispatch = useDispatch()

  const { message, isError, isSuccess, isLoading } = useSelector((state: RootState) => state.auth)

  //Route
  const route = useRouter()

  //Theme
  const theme = useTheme()

  const schema = yup.object().shape({
    email: yup.string().required('The field is required').matches(EMAIL_REG, 'The field is must email type'),
    password: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The password is contain charactor, special charactor, number'),

    confirmPassword: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The password is contain charactor, special charactor, number')
      .oneOf([yup.ref('password'), ''], 'The confirm password is must match with password')
  })

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: { email: string; password: string }) => {
    if (!Object.keys(errors).length) {
      dispatch(registerAuthAsync({ email: data.email, password: data.password }))
    }
  }

  useEffect(() => {
    if (message) {
      if (isError) {
        toast.error(message)
      } else if (isSuccess) {
        toast.success(message)
        route.push(ROUTE_CONFIG.LOGIN)
      }

      dispatch(resetInitialState())
    }
  }, [isSuccess, isError, message])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
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
              Register
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
                      label='Email'
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder='Input email'
                      error={Boolean(errors?.email)}
                      helperText={errors?.email?.message}
                    />
                  )}
                  name='email'
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
                      label='Password'
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
                                <IconifyIcon icon='material-symbols:visibility-outline' />
                              ) : (
                                <IconifyIcon icon='material-symbols:visibility-off-outline' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      placeholder='Input password'
                      error={Boolean(errors?.password)}
                      helperText={errors?.password?.message}
                    />
                  )}
                  name='password'
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
                      label='Confirm password'
                      placeholder='Enter confirm password'
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      type={showConfirmPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {showConfirmPassword ? (
                                <IconifyIcon icon='material-symbols:visibility-outline' />
                              ) : (
                                <IconifyIcon icon='material-symbols:visibility-off-outline' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(errors?.confirmPassword)}
                      helperText={errors?.confirmPassword?.message}
                    />
                  )}
                  name='confirmPassword'
                />
              </Box>

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                Register
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <Typography>{'Do you have already account?'}</Typography>

                <Link
                  href='/login'
                  style={{
                    color: theme.palette.primary.main
                  }}
                >
                  {'Login'}
                </Link>
              </Box>

              <Typography sx={{ textAlign: 'center', mt: 2, mb: 2 }}>Or</Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <IconButton
                  sx={{
                    color: '#497ce2'
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.375rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='currentColor'
                      d='M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z'
                    ></path>
                  </svg>
                </IconButton>

                <IconButton
                  sx={{
                    color: theme.palette.error.main
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.375rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='currentColor'
                      d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z'
                    ></path>
                  </svg>
                </IconButton>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default RegisterPage
