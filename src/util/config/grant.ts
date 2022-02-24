const grantConfig = {
  'defaults': {
    'origin': process.env.HOSTURL,
    'transport': 'session',
    'state': true,
  },
  'google': {
    'key': process.env.GOOGLE_OAUTH_KEY,
    'secret': process.env.GOOGLE_OAUTH_SECRET,
    'scope': ['profile email'],
    'nonce': true,
    'custom_params': {'access_type': 'online'},
    'prefix': '/api/v1/auth/connect',
    'callback': `${process.env.HOSTURL}/api/v1/auth/verify`,
  },
  'github': {
    'key': process.env.GITHUB_OAUTH_KEY,
    'secret': process.env.GITHUB_OAUTH_SECRET,
    'scope': ['read:user', 'user:email'],
    'nonce': true,
    'prefix': '/api/v1/auth/connect',
    'callback': `${process.env.HOSTURL}/api/v1/auth/verify`,
  },
}

export default grantConfig
