// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ys1am7ytp4'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-bscw7p53.us.auth0.com',
  clientId: 'ZDrs3vhmQtowqIe3TViMoxc2NnKN1tfc',
  callbackUrl: 'http://localhost:3000/callback'
}
