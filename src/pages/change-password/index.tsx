//Next
import { NextPage } from 'next'
import { ReactNode } from 'react'

//Layout
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import ChangePasswordPage from 'src/views/pages/change-password'

type TProps = {}

const ChangePassword: NextPage<TProps> = () => {
  return <ChangePasswordPage />
}

export default ChangePassword

ChangePassword.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
