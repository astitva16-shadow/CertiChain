import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/lib/database.types';

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

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  if (!supabaseAdmin) {
    return { statusCode: 500, body: 'Supabase service role is not configured.' };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, body: 'Missing Supabase access token.' };
  }

  const accessToken = authHeader.replace('Bearer ', '');
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !user) {
    return { statusCode: 401, body: 'Invalid Supabase session.' };
  }

  const payload = event.body ? (JSON.parse(event.body) as Record<string, unknown>) : {};
  const requiredFields = [
    'certificate_id',
    'recipient_name',
    'course_name',
    'issuer_name',
    'issued_at',
    'signature',
    'public_key',
  ];
  const missing = requiredFields.filter((field) => payload?.[field] === undefined || payload[field] === '');
  if (missing.length > 0) {
    return { statusCode: 400, body: `Missing fields: ${missing.join(', ')}` };
  }

  const { data, error } = await supabaseAdmin
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
      metadata: ((payload.metadata as Record<string, unknown>) ||
        {}) as Database['public']['Tables']['certificates']['Insert']['metadata'],
      signature: payload.signature as string,
      public_key: payload.public_key as string,
      fingerprint: (payload.fingerprint as string) || null,
      signature_url: (payload.signature_url as string) || null,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    return { statusCode: 400, body: error.message };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ certificate: data }),
  };
};

export { handler };

