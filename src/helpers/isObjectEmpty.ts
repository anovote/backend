/**
* checks the object for any properties to see if it is empty.
* @export
* @param el the object to test
* @return true if empty, false if not
*/
export function isObjectEmpty(el: object): boolean {
  return Object.keys(el).length === 0
}
