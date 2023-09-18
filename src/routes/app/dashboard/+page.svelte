<script lang="ts">
	import type { Group, Panel } from '$lib/config.builder';
	import { configStore } from '$lib/stores/config';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { AppwriteService } from '$lib/appwrite';
	import type { Models } from 'appwrite';
	import { invalidateAll } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { ConicGradient } from '@skeletonlabs/skeleton';
	import type { ConicStop } from '@skeletonlabs/skeleton';

	export let data: PageData;

	let group: Group;
	let panel: Panel;
	$: {
		for (const xgroup of $configStore.groups) {
			for (const xpanel of xgroup.panels) {
				if (xpanel.slug === data.panelSlug) {
					group = xgroup;
					panel = xpanel;
				}
			}
		}
	}
	
	const conicStops: ConicStop[] = [
		{ label: 'Online', color: 'rgba(0,255,0,1)', start: 0, end: 10 },
		{ label: 'Offline', color: 'rgba(255,0,0,0.5)', start: 10, end: 35 }
	];

</script>

<div class="container p-10 space-y-4">
	<h1>{$configStore.dashboard.motd}</h1>
	<hr />
	<div class="card p-4 w-2/4 variant-soft-surface">
	<p><ConicGradient stops={conicStops} legend>Gateway status</ConicGradient></p>
	</div>
</div>