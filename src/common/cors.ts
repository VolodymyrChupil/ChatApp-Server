const allowedOrigins = ["http://localhost:3000", "http://192.168.0.107:3000"]

export const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
}
