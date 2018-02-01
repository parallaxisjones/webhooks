export const success = (res, status) => (entity) => {
  if (entity) {
    return res.status(status || 200).json(entity)
  }
  return null
}

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(404).end()
  return null
}

export const entityExists = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(409).end()
}

export const badRequest = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(400).end()
}

export const authorOrAdmin = (res, user, userField) => (entity) => {
  if (entity) {
    const isAdmin = user.role === 'admin'
    const isAuthor = entity[userField] && entity[userField].equals(user.id)
    if (isAuthor || isAdmin) {
      return entity
    }
    res.status(401).end()
  }
  return null
}
