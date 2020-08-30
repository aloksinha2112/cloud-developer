
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJJOoYD5zqaVFWMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1ic2N3N3A1My51cy5hdXRoMC5jb20wHhcNMjAwODI5MTE1OTU1WhcN
MzQwNTA4MTE1OTU1WjAkMSIwIAYDVQQDExlkZXYtYnNjdzdwNTMudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA+Bv68o+bAlZ38rr2
kv9XEW+z1b213Opcxw5Jj6K+9Nt6FxNAnsPy9I9ZofTepLcGmV3WLy3pLHttY62f
voEO7TXVMYpUANgUBP8webBmj3emHzUBSkxo2ekwebtppqpEwrJzBZz7QlAGxde6
qQUqIoL96ytGrKUsbS0YUYUeCYs8yz0Ytj3dWy2AltGURe/xGYn7PSGqMNIXCiJP
8RCO7RuOfFtcpa6JmK1D3TG7armtdJZ0AQHgk/cLnPf5RXyQ2QlURxS8neCfl4dt
SLVz9otsNSR4PHMDXJuVEAsfg8MaIyTQp3PRrdbLZmAZ5DMV7vMn8peS4bAD+mQI
Ni5OPQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQGh5s1NTAX
b9rkBOH6FLOty52T2zAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AAu6wNwFw9tvALJXUOUUy+nG4EVKiJqJ7uT8Rkf2AGm4g+oJMDBKEtlmTzqScwfx
E8CBOSYVfCBVjmxmEJvA+paT8xYroAsEW3WxuewPcKknfK7l6xxmdH1nTNvCVzo9
FxzP4RYTeupZncLj0FaKfnPPZKhURY3ccRDysSOKogljZCHxmUiSKu8oz3qWJJX+
gBp0Ri/VlWaTf579VaLAn3ND3jXmlwwqdIaQLDRbdfXHWzjzOg0l8cw8EuoWIGAS
W53M4hfW0ecpqbb70SEXZzbEs19zeaROjzmvfNogAR1+QnjgwvAwrJGuvAjEnMEh
nAsul6Y18Zc9MVAqurmuixM=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
