export type GoogleResult = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
  hd: string
}

export type User = {
  id: number
  email: string
  google_access_token?: string
  username?: string
  password?: string
}
