import { test } from '@japa/runner'

test.group('Public index', () => {
  test('GET /public renders', async ({ client }) => {
    const response = await client.get('/public')
    response.assertStatus(200)
  })
})
