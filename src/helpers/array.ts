export function trimItemsInStringArray(array: string[]): string[] {
    const trimmedList: string[] = []

    for (let i = 0; i < array.length; i++) {
        trimmedList.push(array[i].trim())
    }

    return trimmedList
}

export function filterForDuplicates<T>(array: T[]): T[] {
    return array.filter(function (elem, index, self) {
        return index === self.indexOf(elem)
    })
}
