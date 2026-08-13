// Lightweight shim to replace @supabase/supabase-js client.
// Implements a minimal subset used by the frontend: auth methods and simple from(...).select(...)

const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

function authHeaders(): Record<string, string> {
	const token = localStorage.getItem('access_token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export const supabase = {
	auth: {
		async getSession() {
			const access_token = localStorage.getItem('access_token');
			const refresh_token = localStorage.getItem('refresh_token');
			return { data: { session: access_token ? { access_token, refresh_token } : null }, error: null };
		},
		async setSession({ access_token, refresh_token }: any) {
			if (access_token) localStorage.setItem('access_token', access_token);
			if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
			return { data: { session: { access_token, refresh_token } }, error: null };
		},
		onAuthStateChange(_cb: any) {
			// Return object shaped like Supabase client: { data: { subscription } }
			const subscription = { unsubscribe: () => {} };
			// This shim does not implement real listeners; return a shaped object
			const res = { data: { subscription } };
			return res;
		},
		async getUser() {
			try {
				const res = await fetch(`${BASE}/api/profile/me`, { headers: authHeaders() });
				if (!res.ok) return { data: null, error: new Error('Not authenticated') };
				const data = await res.json();
				return { data: { user: data }, error: null };
			} catch (e) {
				return { data: null, error: e };
			}
		},
		async signOut() {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			return { error: null };
		},
	},

	// Very small postgrest-like interface mapped to backend REST endpoints.
	from(table: string) {
		const chain: any = { _table: table, _query: {} };

		chain.select = function (_cols?: string) {
			return chain;
		};

		chain.eq = function (field: string, value: any) {
			chain._query[field] = value;
			return chain;
		};

		chain.in = function (field: string, values: any[]) {
			chain._query[field] = values.join(',');
			return chain;
		};

		chain.order = function (_col: string, _opts: any) {
			return chain;
		};

		chain.limit = function (_n: number) {
			return chain;
		};

		chain.upsert = async function (data: any) {
			try {
				const res = await fetch(`${BASE}/api/${table}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', ...authHeaders() },
					body: JSON.stringify(data),
				});
				const json = await res.json();
				return { data: json, error: res.ok ? null : new Error('upsert failed') };
			} catch (e) {
				return { data: null, error: e };
			}
		};

		chain.then = async function (resolve: any, _reject: any) {
			try {
				const params = new URLSearchParams();
				for (const k of Object.keys(chain._query)) params.set(k, chain._query[k]);
				const url = `${BASE}/api/${table}${params.toString() ? '?' + params.toString() : ''}`;
				const res = await fetch(url, { headers: authHeaders() });
				const json = await res.json();
				return resolve({ data: json, error: null });
			} catch (e) {
				return resolve({ data: null, error: e });
			}
		};

		return chain;
	},

	// minimal channel shim for code that calls .channel().on().subscribe()
	channel(_name: string) {
		return {
			on: () => this,
			subscribe: (cb: any) => {
				setTimeout(() => cb('SUBSCRIBED'), 0);
				return this;
			},
		} as any;
	},

	removeChannel() {
		// no-op
	},
};

