import "dotenv/config";
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from "@/config/env"
import { LinkController } from "@/controllers/link.controller";
import { connectDB } from "@/db/connection";

async function main() {
  await connectDB();

  const app = new Hono()
  
  app.use('/api/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowHeaders: ['Content-Type', 'Authorization'],
  }))
  
  const linkController = new LinkController()
  app.post('/api/shorten', linkController.generateShortLink)
  app.get('/api/:slug', linkController.redirectToLongUrl)
  
  app.get('/api', (c) => {
    return c.text('Welcome to MiniLink!')
  })
  

  serve({
    fetch: app.fetch,
    port: env.PORT
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  })

}

main().catch((err) => {
  console.error("Failed to start the server:", err);
  process.exit(1);
});