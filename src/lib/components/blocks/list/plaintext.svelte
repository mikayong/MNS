<script lang="ts">
	import type { Block, Group, Panel } from '$lib/config.builder';
	import type { ListInterface, ListPlaintext } from '$lib/config.interfaces';
	import type { Models } from 'appwrite';

	export let config: ListPlaintext;
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
	{#if lastSeen <= 300000}
		<p class="max-h-[24px] overflow-hidden text-green-400">Connected</p>
	{:else if (lastSeen > 300000) && (lastSeen <= 7200000) }
		<p class="max-h-[24px] overflow-hidden text-red-300">LastSeen {Math.floor(lastSeen/60000)}Mins ago</p>
	{:else if (lastSeen > 7200000) && (lastSeen < 172800000)}
		<p class="max-h-[24px] overflow-hidden text-red-600">LastSeen {Math.floor(lastSeen/3600000)}Hours ago</p>
	{:else}
		<p class="max-h-[24px] overflow-hidden text-red-600">LastSeen {Math.floor(lastSeen/86400000)}Days ago</p>
	{/if}
{:else}
	<p class="max-h-[24px] overflow-hidden">{value}</p>
{/if}
