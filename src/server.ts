import App from './app'
import * as listEndpoints from 'express-list-endpoints'

async function main(): Promise<void> {
  const app = await App.init()
  app.getExpress().listen(3000, () => {
    console.log(
      'Express server has started on port 3000.' +
        ' Open http://localhost:3000 to see results'
    )
    console.log(listEndpoints(app.getExpress()))
  })
}

main()
