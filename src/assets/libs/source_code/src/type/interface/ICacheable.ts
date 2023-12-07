import Collection from 'src/core/common/Collection'

interface ICacheable<T> {
  getCacheStore: () => Collection<T>
}

export default ICacheable
