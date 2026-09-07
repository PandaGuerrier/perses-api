import { test } from '@japa/runner'

test.group('Auth index', () => {
  test('GET /auth renders', async ({ client }) => {
    const response = await client.get('/auth')
    response.assertStatus(200)
  })
})
