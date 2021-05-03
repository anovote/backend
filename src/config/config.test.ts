import config from '@/config'

it('should have config fields populated', () => {
    function traverse(ob: any) {
        for (const key in ob) {
            if (Object.prototype.hasOwnProperty.call(ob, key)) {
                if (ob[key] instanceof Object) traverse(key)
                else expect(!!ob[key]).toBeTruthy()
            }
        }
    }
    traverse(config)
})
