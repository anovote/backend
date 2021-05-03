export function filterForDuplicates(array: string[]): string[] {
    return array.filter(function (elem, index, self) {
        return index === self.indexOf(elem)
    })
}

export function trimItemsInArray(array: string[]): string[] {
    const trimmedList: string[] = []

    for (let i = 0; i < array.length; i++) {
        trimmedList.push(array[i].trim())
    }

    return trimmedList
}
