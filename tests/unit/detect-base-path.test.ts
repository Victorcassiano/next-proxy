import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { join } from 'path'
import { mkdirSync, rmSync, existsSync } from 'fs'
import { detectBasePath } from '../../src/utils/detect-base-path.js'

describe('detectBasePath', () => {
  let originalCwd: string
  let tempDir: string

  beforeEach(() => {
    originalCwd = process.cwd()
    tempDir = join(originalCwd, '.detect-base-path-test-temp')
    mkdirSync(tempDir, { recursive: true })
    process.chdir(tempDir)
  })

  afterEach(() => {
    process.chdir(originalCwd)
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('should return "." when app/ exists at root', () => {
    mkdirSync(join(tempDir, 'app'))
    expect(detectBasePath()).toBe('.')
  })

  it('should return "." when pages/ exists at root', () => {
    mkdirSync(join(tempDir, 'pages'))
    expect(detectBasePath()).toBe('.')
  })

  it('should return "src" when src/app/ exists', () => {
    mkdirSync(join(tempDir, 'src', 'app'), { recursive: true })
    expect(detectBasePath()).toBe('src')
  })

  it('should return "src" when src/pages/ exists', () => {
    mkdirSync(join(tempDir, 'src', 'pages'), { recursive: true })
    expect(detectBasePath()).toBe('src')
  })

  it('should return "." when neither root nor src router exists', () => {
    expect(detectBasePath()).toBe('.')
  })

  it('should prefer root over src when both exist', () => {
    mkdirSync(join(tempDir, 'app'))
    mkdirSync(join(tempDir, 'src', 'app'), { recursive: true })
    expect(detectBasePath()).toBe('.')
  })

  it('should prefer root pages/ over src/app/', () => {
    mkdirSync(join(tempDir, 'pages'))
    mkdirSync(join(tempDir, 'src', 'app'), { recursive: true })
    expect(detectBasePath()).toBe('.')
  })

  it('should return "." when only empty src/ exists', () => {
    mkdirSync(join(tempDir, 'src'))
    expect(detectBasePath()).toBe('.')
  })
})
