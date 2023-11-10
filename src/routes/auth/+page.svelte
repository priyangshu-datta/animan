<script lang="ts">
	import { redirect } from '@sveltejs/kit'
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'


	setTimeout(() => {
		goto("/home")
	}, 1000)
</script>

<h1>Redirecting to Home...</h1>
