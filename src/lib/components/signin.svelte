<script lang="ts">
	import { page } from '$app/stores';

	const redirectTo = $derived($page.url.searchParams.get('redirect_to'));
</script>

<a href="/signin/google{redirectTo ? `?redirect_to=${redirectTo}` : ''}"> Sign in with Google </a>
