<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import type { Group, Label, Panel } from '$lib/config.builder';
    import { ViewInterface } from '$lib/config.interfaces';
	import { configStore } from '$lib/stores/config';
	import type { PageData } from './$types';
	import { clipboard } from '@skeletonlabs/skeleton';

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
</script>

<Navbar
	title="GatewayID"
	description="Gateway infomation"
	subtitle={data.panelDocument.gwID}
	icon="👀"
>
	<div class="flex items-center justify-end space-x-4">
		{#if !panel.singletonId}
			<a href={`/app/panels/${panel.slug}`} class="flex items-center justify-center group">
				<div class="p-3 text-sm  text-primary-800 rounded-l-md group-hover:bg-primary-200 bg-primary-100">
					Close
				</div>
				<div class="p-3  text-primary-800 rounded-r-md group-hover:bg-primary-300 bg-primary-200">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</div>
			</a>
		{/if}

		{#if panel.editEnabled}
			<a
				href={`/app/panels/${panel.slug}/edit/${data.panelDocument.$id}`}
				class="flex items-center justify-center group"
			>
				<div class="p-3 text-sm text-white  group-hover:bg-primary-900 rounded-l-md bg-primary-800">
					Edit
				</div>
				<div class="p-3 text-white  rounded-r-md group-hover:bg-black bg-primary-900">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
						/>
					</svg>
				</div>
			</a>
		{/if}
	</div>
</Navbar>

<div class="w-full flex">
{#if panel.name == "Gateways"}
	<div class="card p-4 w-1/2 inline-block my-6 mx-6 shadow-lime-50 variant-soft-secondary">
		{#each panel.blocks as block}
			{@const value = data.panelDocument[block.attribute]}
			{#if String(value).length > 0}
				<div class="p-4">
					{#if block.attribute == "gwID"}
							<div class="pre inline-block w-36 variant-filled-primary text-xl">GatewayID</div>
							<div class="pre inline-block w-96 variant-filled-secondary text-xl" data-clipboard={block.attribute}>{data.panelDocument[block.attribute]}</div>
							<div class="pre inline-block w-20 variant-filled-tertiary text-xl">
								<button use:clipboard={{element: block.attribute}}>Copy</button>
							</div>
					{:else if block.attribute == "status"}
							<div class="pre inline-block w-36 variant-filled-primary text-xl">Status</div>
							<div class="pre inline-block w-96 variant-filled-secondary text-xl">None</div>
					{:else}
							<div class="pre inline-block w-36 variant-filled-primary text-xl">{block.attribute}</div>
							<div class="pre inline-block w-96 variant-filled-secondary text-xl">{data.panelDocument[block.attribute]}</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	<div class="card card-hover p-4 w-1/3 inline-block my-6 mx-8 shadow-lime-50 variant-soft-tertiary">
		<div><p class="chip variant-filled-primary m-2 text-2xl"><b>Gateway Overview</b></p></div>
		<hr class="!border-t-2" /> <br />
		<div><p class="chip variant-filled-secondary m-2 text-xl">GreateAt :&nbsp<span class="variant-filled-success">{data.panelDocument['$createdAt']}</span></p></div>
		<div><p class="chip variant-filled-secondary m-2 text-xl">LastSeen :&nbsp<span class={(Date.now() - Date.parse(data.panelDocument['$updatedAt'])) > 300000 ? "bg-red-500" : "bg-green-100"}>{data.panelDocument['$updatedAt']}</span></p></div>
		<div><p class="chip variant-filled-secondary m-2 text-xl">Uptime</p></div>
		<div><p class="chip variant-filled-secondary m-2 text-xl">OS</p></div>
		<div><p class="chip variant-filled-secondary m-2 text-xl">FWD version</p></div>
		<div><p class="chip variant-filled-secondary m-2 text-xl">Hardisk</p></div>
		<div><p class="chip variant-filled-secondary m-2 text-xl">Memery</p></div>
	</div>
{:else}
	<div class="card p-4 w-1/3">
	</div>
{/if}
</div>
