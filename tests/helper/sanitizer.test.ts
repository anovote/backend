import { strip } from '@/helpers/sanitize'

let targetObject: Record<string, unknown>
beforeEach(() => {
  targetObject = {
    a: 'a',
    b: 'b',
    c: 'c',
    d: {
      aa: 'aa',
      bb: 'bb',
      cc: {
        aaa: 'aaa'
      }
    }
  }
})

it('should strip keys from object', () => {
  const stripKeys = ['a', 'b']
  const stripped = strip(targetObject, stripKeys)
  for (const key of stripKeys) {
    expect((stripped as any)[key]).toBeUndefined()
  }
})

it('should not alter the original object', () => {
  const stripKeys = ['a', 'b']
  const stripped = strip(targetObject, stripKeys)
  expect(stripped).not.toEqual(targetObject)
})

it('should not change object if keys do not exist', () => {
  const stripKeys = ['x', 'y']
  const stripped = strip(targetObject, stripKeys)
  expect(stripped).toEqual(targetObject)
})

it('should return undefined if target is not of type object', () => {
  const stripKeys = ['x', 'y']
  const strippedList = [strip('', stripKeys), strip(34, stripKeys), strip([''], stripKeys)]
  for (const stripped of strippedList) {
    expect(stripped).toBeUndefined()
  }
})
