interface ICollection<T> {
  getArray: () => Array<T>

  push: (element: T) => number

  clear: () => void
}

export default ICollection
