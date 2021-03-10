export function filterForDuplicates(array: string[]): string[] {
    return array.filter(function (elem, index, self) {
        return index === self.indexOf(elem)
    })
}
