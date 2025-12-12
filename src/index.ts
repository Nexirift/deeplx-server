import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { query } from '@ifyour/deeplx';
import { HTTPException } from 'hono/http-exception';

const SUPPORTED_LANGUAGES = [
  'el', 'bg', 'lv', 'ko', 'lt', 'id', 'uk', 'sl', 'sk', 'tr', 'ro', 'cs',
  'et', 'fi', 'da', 'hu', 'sv', 'nb', 'ru', 'pl', 'pt', 'nl', 'it', 'es',
  'fr', 'de', 'ja', 'en', 'zh'
] as const;

type Lang = typeof SUPPORTED_LANGUAGES[number];
type SourceLang = Lang | 'auto';
type TargetLang = Lang;

type RequestParams = {
  text: string;
  source_lang: SourceLang;
  target_lang: TargetLang;
};

const app = new Hono()

app.get('/', c => {
  return c.redirect('/translate');
});

app.get('/translate', c => {
  return c.text('Please use post method to request');
});

app.post('/translate', async c => {
  let params: RequestParams;
  try {
    params = await c.req.parseBody();
    return c.json(await query(params));
  } catch (error) {
    throw new HTTPException
      (500, {
        message
          : 'An internal server error occured.'
      })
  }
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
