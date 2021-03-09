export function filterForDuplicates<T>(array: T[]): T[] {
    return array.filter(function (elem, index, self) {
        return index === self.indexOf(elem)
    })
}
