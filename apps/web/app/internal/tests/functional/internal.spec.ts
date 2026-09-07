import { test } from '@japa/runner'

test.group('Internal index', () => {
  test('GET /internal renders', async ({ client }) => {
    const response = await client.get('/internal')
    response.assertStatus(200)
  })
})
