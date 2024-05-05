//Next
import { NextPage } from 'next'

//MUI
import { Avatar, Box, Button, Grid, IconButton, useTheme } from '@mui/material'

//Components
import CustomTextField from 'src/components/text-field'
import IconifyIcon from 'src/components/Icon'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import FallbackSpinner from 'src/components/fall-back'

//Form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

//Configs
import { EMAIL_REG } from 'src/configs/regex'

//React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

//Service
import { getAuthMe } from 'src/services/auth'

//Utils
import { convertBase64, separationFullName, toFullName } from 'src/utils'

//Redux
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/apps/auth'
import { updateAuthMeAsync } from 'src/stores/apps/auth/actions'
import { useDispatch, useSelector } from 'react-redux'

type TProps = {}

type TDefaultValues = {
  email: string
  fullName: string
  city: string
  address: string
  phoneNumber: string
  role: string
}

const MyProfilePage: NextPage<TProps> = () => {
  //State
  const [loading, setLoading] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string>('')
  const [roleId, setRoleId] = useState<string>('')

  //Theme
  const theme = useTheme()

  //Translate
  const { t, i18n } = useTranslation()

  //Redux
  const dispatch: AppDispatch = useDispatch()

  const { isLoading, isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

  const schema = yup.object().shape({
    email: yup.string().required('The field is required').matches(EMAIL_REG, 'The field is must email type'),
    fullName: yup.string().notRequired(),
    city: yup.string().notRequired(),
    address: yup.string().notRequired(),
    phoneNumber: yup.string().required('The field is required').min(8, 'The phone number is min 8 numbers'),
    role: yup.string().required('The field is required')
  })

  const dedaultValues: TDefaultValues = {
    email: '',
    fullName: '',
    city: '',
    address: '',
    phoneNumber: '',
    role: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: dedaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const fetchGetAuthMe = async () => {
    setLoading(true)
    await getAuthMe()
      .then(async response => {
        setLoading(false)
        const data = response?.data
        if (data) {
          setRoleId(data?.role?._id)
          setAvatar(data?.avatar)
          reset({
            email: data?.email,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
            city: data?.city,
            address: data?.address,
            phoneNumber: data?.phoneNumber,
            role: data?.role?.name
          })
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchGetAuthMe()
  }, [i18n.language])

  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
        fetchGetAuthMe()
      }

      dispatch(resetInitialState())
    }
  }, [isSuccessUpdateMe, isErrorUpdateMe, messageUpdateMe])

  const onSubmit = (data: any) => {
    const { firstName, lastName, middleName } = separationFullName(data.fullName, i18n.language)

    dispatch(
      updateAuthMeAsync({
        email: data.email,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        role: roleId,
        phoneNumber: data.phoneNumber,
        avatar,
        address: data.address
      })
    )
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  return (
    <>
      {loading || (isLoading && <FallbackSpinner />)}
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
                    <Box
                      sx={{
                        position: 'relative'
                      }}
                    >
                      {avatar && (
                        <IconButton
                          sx={{
                            position: 'absolute',
                            bottom: -4,
                            right: -6,
                            zIndex: 2,
                            color: theme.palette.error.main
                          }}
                          onClick={() => setAvatar('')}
                        >
                          <IconifyIcon icon='material-symbols-light:delete-outline' />
                        </IconButton>
                      )}

                      {avatar ? (
                        <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                          <IconifyIcon icon='ph:user-thin' fontSize={70} />
                        </Avatar>
                      ) : (
                        <Avatar sx={{ width: 100, height: 100 }}>
                          <IconifyIcon icon='ph:user-thin' fontSize={70} />
                        </Avatar>
                      )}
                    </Box>

                    <WrapperFileUpload
                      uploadFunc={handleUploadAvatar}
                      objectAcceptFile={{
                        'image/jpeg': ['.jpg', '.jpeg'],
                        'image/png': ['.png']
                      }}
                    >
                      <Button
                        variant='outlined'
                        sx={{ width: 'auto', display: 'flex', alignContent: 'center', gap: 1 }}
                      >
                        <IconifyIcon icon='ph:camera-thin' />
                        {avatar ? t('change_avatar') : t('upload_avatar')}
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
                        disabled
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
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        fullWidth
                        label={t('Full_name')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('enter_your_full_name')}
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
                        required
                        label={t('Phone_number')}
                        onChange={e => {
                          const numValue = e.target.value.replace(/\D/g, '')
                          onChange(numValue)
                        }}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                          minLength: 8
                        }}
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
    </>
  )
}

export default MyProfilePage
