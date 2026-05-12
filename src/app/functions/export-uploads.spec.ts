import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { isRight, unwrapEither } from '@/shared/either'
import { makeUpload } from '@/test/factory/make-upload'
import { exportUploads } from './export-uploads'

vi.mock('@/infra/storage/upload-file-to-storage', () => ({
  uploadFileToStorage: vi.fn(async ({ contentStream }) => {
    for await (const _chunk of contentStream) {
      // Drain the report stream so the CSV pipeline can finish.
    }

    return {
      key: 'downloads/uploads.csv',
      url: 'https://storage.com/uploads.csv',
    }
  }),
}))

describe('export uploads', () => {
  it('should be able to export uploads', async () => {
    const namePattern = randomUUID()

    await makeUpload({ name: `${namePattern}.webp` })
    await makeUpload({ name: `${namePattern}.webp` })
    await makeUpload({ name: `${namePattern}.webp` })
    await makeUpload({ name: `${namePattern}.webp` })
    await makeUpload({ name: `${namePattern}.webp` })

    const sut = await exportUploads({
      searchQuery: namePattern,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toEqual(
      'https://storage.com/uploads.csv'
    )
  })
})
