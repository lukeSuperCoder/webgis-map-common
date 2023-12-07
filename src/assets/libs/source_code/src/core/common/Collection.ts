import ICollection from 'src/type/interface/ICollection'

class Collection<T> implements ICollection<T> {
  private _array: Array<T>

  constructor() {
    this._array = []
  }

  push(element: T) {
    this._array.push(element)

    return this._array.length
  }

  getArray() {
    return this._array
  }

  clear() {
    this._array = []
  }
}

export default Collection
