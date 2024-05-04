//Next
import { NextPage } from 'next'

//MUI
import { Avatar, Box, Button, Grid, useTheme } from '@mui/material'

//Components
import CustomTextField from 'src/components/text-field'
import IconifyIcon from 'src/components/Icon'

//Form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

//Configs
import { EMAIL_REG } from 'src/configs/regex'

//React

//Image

import { useTranslation } from 'react-i18next'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect } from 'react'

type TProps = {}

const MyProfilePage: NextPage<TProps> = () => {
  //State
  const { user } = useAuth()

  //Theme
  const theme = useTheme()

  //Translate
  const { t } = useTranslation()

  const schema = yup.object().shape({
    email: yup.string().required('The field is required').matches(EMAIL_REG, 'The field is must email type'),
    fullName: yup.string().required('The field is required'),
    city: yup.string().required('The field is required'),
    address: yup.string().required('The field is required'),
    phoneNumber: yup.string().required('The field is required'),
    role: yup.string().required('The field is required')
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      address: '',
      city: '',
      phoneNumber: '',
      role: '',
      fullName: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (user) {
      reset({
        role: user?.role?.name
      })
    }
  }, [user])

  const onSubmit = (data: any) => {
    console.log('>>> data', data)
  }

  const handleUploadAvatar = (file: File) => {}

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
      <Grid container>
        <Grid
          container
          item
          md={6}
          xs={12}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            py: 5,
            px: 4
          }}
        >
          <Box sx={{ height: '100%', width: '100%' }}>
            <Grid container spacing={4}>
              <Grid item md={12} xs={12}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <Avatar sx={{ width: 100, height: 100 }}>
                    <IconifyIcon icon='ph:user-thin' fontSize={70} />
                  </Avatar>
                  <WrapperFileUpload
                    uploadFunc={handleUploadAvatar}
                    objectAcceptFile={{
                      'image/jpeg': ['.jpg', '.jpeg'],
                      'image/png': ['.png']
                    }}
                  >
                    <Button variant='outlined' sx={{ width: 'auto', display: 'flex', alignContent: 'center', gap: 1 }}>
                      <IconifyIcon icon='ph:camera-thin' />
                      {t('upload_avatar')}
                    </Button>
                  </WrapperFileUpload>
                </Box>
              </Grid>

              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Email')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_email')}
                      error={Boolean(errors?.email)}
                      helperText={errors?.email?.message}
                    />
                  )}
                  name='email'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      disabled
                      label={t('Role')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_role')}
                      error={Boolean(errors?.role)}
                      helperText={errors?.role?.message}
                    />
                  )}
                  name='role'
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '15px',
              py: 5,
              px: 4
            }}
            marginLeft={{
              md: 5,
              xs: 0
            }}
          >
            <Grid container spacing={4}>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Full_name')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_full_name')}
                      error={Boolean(errors?.fullName)}
                      helperText={errors?.fullName?.message}
                    />
                  )}
                  name='fullName'
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      fullWidth
                      label={t('Address')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_address')}
                      error={Boolean(errors?.address)}
                      helperText={errors?.address?.message}
                    />
                  )}
                  name='address'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      fullWidth
                      label={t('City')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_city')}
                      error={Boolean(errors?.city)}
                      helperText={errors?.city?.message}
                    />
                  )}
                  name='city'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      fullWidth
                      label={t('Phone_number')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_phone_number')}
                      error={Boolean(errors?.phoneNumber)}
                      helperText={errors?.phoneNumber?.message}
                    />
                  )}
                  name='phoneNumber'
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
          {t('Update')}
        </Button>
      </Box>
    </form>
  )
}

export default MyProfilePage
