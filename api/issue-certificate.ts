import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/database.types';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.SUPABASE_PROJECT_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient<Database>(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
    : null;

const requiredFields = [
  'certificate_id',
  'recipient_name',
  'course_name',
  'issuer_name',
  'issued_at',
  'signature',
  'public_key',
];

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).send('Method not allowed');
  }

  if (!supabaseAdmin) {
    return response.status(500).send('Supabase service role is not configured.');
  }

  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return response.status(401).send('Missing Supabase access token.');
  }

  const accessToken = authHeader.replace('Bearer ', '');
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !user) {
    return response.status(401).send('Invalid Supabase session.');
  }

  const payload =
    typeof request.body === 'string'
      ? (JSON.parse(request.body) as Record<string, unknown>)
      : ((request.body || {}) as Record<string, unknown>);
  const missing = requiredFields.filter((field) => payload?.[field] === undefined || payload[field] === '');
  if (missing.length > 0) {
    return response.status(400).send(`Missing fields: ${missing.join(', ')}`);
  }

  const { error, data } = await supabaseAdmin
    .from('certificates')
    .insert({
      certificate_id: payload.certificate_id as string,
      user_id: user.id,
      recipient_name: payload.recipient_name as string,
      recipient_email: (payload.recipient_email as string) || null,
      course_name: payload.course_name as string,
      issuer_name: payload.issuer_name as string,
      issued_at: (payload.issued_at as string) || new Date().toISOString(),
      notes: (payload.notes as string) || null,
      metadata: ((payload.metadata as Record<string, unknown>) || {}) as Database['public']['Tables']['certificates']['Insert']['metadata'],
      signature: payload.signature as string,
      public_key: payload.public_key as string,
      fingerprint: (payload.fingerprint as string) || null,
      signature_url: (payload.signature_url as string) || null,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    return response.status(400).send(error.message);
  }

  return response.status(200).json({ certificate: data });
}

