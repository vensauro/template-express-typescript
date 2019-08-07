import App from './app'

async function main(): Promise<void> {
  const express = await App.init()
  express.listen(3000, () => {
    console.log(
      'Express server has started on port 3000.' +
        ' Open http://localhost:3000/users to see results'
    )
  })
}

main()
