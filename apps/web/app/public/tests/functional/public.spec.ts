import { test } from '@japa/runner'

test.group('Public index', () => {
  test('GET / renders the public page', async ({ client }) => {
    const response = await client.get('/')
    response.assertStatus(200)
  })
})
