//Config
import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

//Type
import { TLoginAuth } from 'src/types/auth'

export const LoginAuth = async (data: TLoginAuth) => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.AUTH.INDEX}/login`, data)

    return res.data
  } catch (error) {
    return null
  }
}

export const LogoutAuth = async () => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.AUTH.INDEX}/logout`)

    return res.data
  } catch (error) {
    return null
  }
}
