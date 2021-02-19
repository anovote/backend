import { strip } from '@/helpers/sanitize'

let targetObject: object
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

it('should strip keys from object', async () => {
  const stripKeys = ['a', 'b']
  let stripped = strip(targetObject, stripKeys)
  for (const key of stripKeys) {
    expect((stripped as any)[key]).toBeUndefined()
  }
})

it('should not alter the original object', async () => {
  const stripKeys = ['a', 'b']
  let stripped = strip(targetObject, stripKeys)
  expect(stripped).not.toEqual(targetObject)
})

it('should not change object if keys do not exist', async () => {
  const stripKeys = ['x', 'y']
  let stripped = strip(targetObject, stripKeys)
  expect(stripped).toEqual(targetObject)
})

it('should return undefined if target is not of type object', async () => {
  const stripKeys = ['x', 'y']
  const strippedList = [strip('', stripKeys), strip(34, stripKeys), strip([''], stripKeys)]
  for (const stripped of strippedList) {
    expect(stripped).toBeUndefined()
  }
})
