import React from 'react'



function loginwithgoogle() {


  const runGoogleSignIn = () => {
    const google_client_id = "615548516742-tgnelddahl41q457r0amut844mpoecv5.apps.googleusercontent.com"
const server_endpoint = "http://localhost:4000"

const redirect_uri = "http://localhost:4000/api/v2/auth/login-google"

const rootUrl = 'https://accounts.google.com/o/oauth2/auth'

const options = {
    redirect_uri: redirect_uri,
    client_id: google_client_id,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [    "https://www.googleapis.com/auth/userinfo.profile",   "https://www.googleapis.com/auth/userinfo.email"
    ].join(" ")
}

  const qs = new URLSearchParams(options)
 
  return `${rootUrl}?${qs.toString()}`
  }

  return (
    <div> <a href={runGoogleSignIn()}>Login with Google</a> </div>
  )
}

export default loginwithgoogle