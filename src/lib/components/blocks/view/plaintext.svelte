<script lang="ts">
	import type { Block, Group, Panel } from '$lib/config.builder';
	import type { ViewPlaintext } from '$lib/config.interfaces';
	import type { Models } from 'appwrite';

	export let config: ViewPlaintext;
	export let document: any & Models.Document;
	export let value: any;
	export let panel: Panel;
	export let group: Group;
	export let block: Block;
	export let ready = true;
	export let lastSeen: number;

	// Prevents compilation errors
	config; document; value; panel; group; block; ready; lastSeen;
</script>

{#if block.attribute === "status"}
	{#if lastSeen < 300000}
		<p class="w-20 max-h-[24px] overflow-hidden bg-green-500">Connected</p>
	{:else}
		<p class="w-20 max-h-[24px] overflow-hidden bg-red-600">Offline</p>
	{/if}
{:else}
	<p class=" from-blue-500 to-cyan-300 overflow-hidden">{value}</p>
{/if}
