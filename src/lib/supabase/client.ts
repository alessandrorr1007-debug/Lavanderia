import {createClient} from "@supabase/supabase-js";
/** Solo usar en fase con autenticación real y políticas RLS comprobadas. */
export function getSupabaseBrowserClient(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!key)throw new Error("Supabase no configurado; continúa en modo demo.");return createClient(url,key);}
