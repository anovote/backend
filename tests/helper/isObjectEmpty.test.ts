import { isObjectEmpty } from '@/helpers/isObjectEmpty'
import { Election } from '@/models/Election/ElectionEntity'

it('should return true if all object fields are not set', () => {
  const election = new Election()
  expect(isObjectEmpty(election)).toBeTruthy()
})

it('should return false if object field is set', () => {
  const election = new Election()
  election.title = "I'm not empty"

  expect(isObjectEmpty(election)).toBeFalsy()
})

it('should return true if object = object', () => {
  const emptyObj = Object
  expect(isObjectEmpty(emptyObj)).toBeTruthy()
})
