import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
})
const configProject = configSchema.safeParse({
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
})

if (!configProject.success) {
  console.error(configProject.error.errors)
  throw new Error('Invalid declaration of environment variables')
}

export const envConfig = configProject.data

// const configServerSchema = z.object({
//   ONLY_SERVER_TEXT: z.string(),
// })
// const configServerProject = configServerSchema.safeParse({
//   ONLY_SERVER_TEXT: process.env.ONLY_SERVER_TEXT,
// })

// if (typeof window === 'undefined' && !configServerProject.success) {
//   console.error(configServerProject.error.errors)
//   throw new Error('Invalid declaration of environment variables')
// }

// export const envServerConfig = configServerProject.data
