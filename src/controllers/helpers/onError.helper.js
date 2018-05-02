const onError = (res, action) => (err) => {
  console.error(`[ERROR] ${action}`, err)
  res.status(err.statusCode || 500).json(
    { message: action, err }
  );
}

export { onError };
