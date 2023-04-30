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

  const runFacebookSignIn = () => {
    const fb_client_id = "560358619285745"
const server_endpoint = "http://localhost:4000"

const redirect_uri = "https://432d-102-89-47-187.ngrok-free.app/api/v2/auth/login-facebook"

const rootUrl = 'https://www.facebook.com/v4.0/dialog/oauth'

const options = {
  client_id: fb_client_id,
  redirect_uri: redirect_uri,
  scope: ['email'].join(','), // comma seperated string
  response_type: 'code',
  auth_type: 'rerequest',
  display: 'popup',
}  

  const qs = new URLSearchParams(options)
 
  return `${rootUrl}?${qs.toString()}`
  }

  return (
    <div>
       <a href={runGoogleSignIn()}>Login with Google</a> 
       <br/>
       <a href={runFacebookSignIn()}>Login with Facebook</a> 
       </div>
  )
}

export default loginwithgoogle