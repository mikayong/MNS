<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import type { Group, Label, Panel } from '$lib/config.builder';
    import { ViewInterface } from '$lib/config.interfaces';
	import { configStore } from '$lib/stores/config';
	import type { PageData } from './$types';
	import { clipboard, getDrawerStore } from '@skeletonlabs/skeleton';
	import { ConicGradient } from '@skeletonlabs/skeleton';
	import type { ConicStop } from '@skeletonlabs/skeleton';

	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	let configSet: number = 0;

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

	let gwStatus: string = "none";
	let lastSeen: number = Date.now() - Date.parse(data.panelDocument['$updatedAt']);

	if (lastSeen <= 300000) {
		gwStatus = "Connected";
	} else if (lastSeen <= 7200000) {
		gwStatus = "Last seen " + Math.floor(lastSeen/60000) + " Mins ago";
	} else if (lastSeen <= 172800000) {
		gwStatus = "Last seen " + Math.floor(lastSeen/3600000) + " Hours ago";
	} else {
		gwStatus = "Last seen " + Math.floor(lastSeen/86400000) + " Days ago";
	}

	let gwConfig: any = JSON.parse(data.gwConfig.gwConfig);
	let gwShadow: any = JSON.parse(data.gwShadow.gwShadow);

	const freeHardisk = Math.ceil(gwShadow.hardisk[0].free / (gwShadow.hardisk[0].total + 1));
	const freeMemory = Math.ceil(gwShadow.memory.free / (gwShadow.memory.total + 1));
	const cacheMemory = Math.ceil(gwShadow.memory.cache / (gwShadow.memory.total + 1));
	
    const hardisk: ConicStop[] = [
    	{ label: 'free', color: 'rgba(2, 255, 1, 1)', start: 0, end: freeHardisk },
    	{ label: 'used', color: 'rgba(255, 5, 1, 1)', start: freeHardisk, end: (100 - freeHardisk + 1) }
    ];

    const memory: ConicStop[] = [
    	{ label: 'free', color: 'rgba(2, 255, 1, 1)', start: 0, end: freeMemory },
    	{ label: 'cache', color: 'rgba(25, 5, 255, 1)', start: (freeMemory), end: cacheMemory + 1 },
    	{ label: 'used', color: 'rgba(255, 5, 1, 1)', start: (freeMemory + cacheMemory + 1), end: (100 - freeMemory - cacheMemory + 3) }
    ];

</script>

<Navbar
	title="GatewaySN"
	description={gwStatus}
	subtitle={data.panelDocument.gwSN}
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

<div class="flex flex-row p-8">
	{#if panel.name == "Gateways"}
		<div class="m-6 p-2">
			<div class="mx-10 my-4 px-2 py-4 w-2/3 text-3xl font-extrabold bg-primary-100"> General configure </div>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md">
				<div class="input-group-shim font-extrabold text-lg w-48">GatewaySN</div>
				<input name="gwSN" type="text" value={data.panelDocument.gwSN}  readonly/>
				<button class="variant-soft-secondary ">Copy</button>
			</div>
			<div class="input-group input-group-divider flex grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
				<div class="input-group-shim font-extrabold text-lg w-48">GatewayID</div>
				<input name="gwSN" type="text" value={gwConfig.gwID} readonly/>
				<button class="variant-soft-secondary ">Copy</button>
			</div>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
				<div class="input-group-shim font-extrabold text-lg w-48">Gateway group</div>
				<input class="w-3/5" name="gwGroup" type="text" value={gwConfig.gwGroup} readonly/>
			</div>				
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
				<div class="input-group-shim font-extrabold text-lg w-48">Gateway model</div>
				<input class="w-3/5" name="gwModel" type="text" value={gwConfig.gwModel} readonly/>
			</div>				
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
				<div class="input-group-shim font-extrabold text-lg w-48">Gateway Region</div>
				<input class="w-3/5" name="gwRegion" type="text" value={gwConfig.gwRegion} readonly/>
			</div>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
				<div class="input-group-shim font-extrabold text-lg w-48">Description</div>
				<textarea class="mx-3 textarea" name="gwDesc" rows="4" value={gwConfig.gwDesc} readonly/>
			</div>

			<div class="mx-10 my-4 px-2 py-4 w-2/3 text-3xl font-extrabold bg-primary-100"> LoRaWan Configure </div>
			
                <TabGroup class="w-2/3">
					<div class="flex mx-10 rounded-md">
                	<Tab bind:group={configSet} name="fwdConfigure" value={0}>
                		<div class="text-xl font-bold">Forwarder</div>
                	</Tab>
                	<Tab bind:group={configSet} name="stationConfigure" value={1}>
						<div class="text-xl font-bold">Basicstation</div>
					</Tab>
					</div>
                	<!-- Tab Panels --->
                	<svelte:fragment slot="panel">
					<div>
                		{#if configSet === 0}
						    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
						    	<div class="input-group-shim font-extrabold text-lg w-48">Server name</div>
						    	<input name="serverName" type="text" value={gwConfig.fwdConfig.servers[0].serverName} readonly/>
						    </div>
						    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
						    	<div class="input-group-shim font-extrabold text-lg w-48">Status interval</div>
						    	<input name="statusInterval" type="number" value={gwConfig.statInterval} readonly/>
						    </div>
						    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
						    	<div class="input-group-shim font-extrabold text-lg w-48">Server addr</div>
						    	<input name="serverAddr" type="text" value={gwConfig.fwdConfig.servers[0].serverAddr} readonly/>
						    </div>
						    <div class="flex mx-10">
						        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-md my-2">
						        	<div class="input-group-shim font-extrabold text-lg w-28">UP port</div>
						        	<input name="uplinkPort" type="number" value={gwConfig.fwdConfig.servers[0].uplinkPort} readonly/>
						        </div>
						        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-md my-2 ml-16">
						        	<div class="input-group-shim font-extrabold text-lg w-28">Down </div>
						        	<input name="uplinkPort" type="text" value={gwConfig.fwdConfig.servers[0].dnlinkPort} readonly/>
						        </div>
						    </div>
						    <div class="flex mx-10">
						        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-md my-2">
						        	<div class="input-group-shim font-extrabold text-lg w-36">FportFilter</div>
						        	<input name="fportFilter" type="number" value={gwConfig.fwdConfig.servers[0].fportFilter} readonly/>
						        </div>
						        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-md my-2 ml-16">
						        	<div class="input-group-shim font-extrabold text-lg w-36">DevaddrFilter </div>
						        	<input name="addrFilter" type="text" value={gwConfig.fwdConfig.servers[0].addrFilter} readonly/>
						        </div>
						    </div>
                		{:else if configSet === 1}
						    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
						    	<div class="input-group-shim font-extrabold text-lg w-48">StationURI</div>
						    	<input name="stationURI" type="text" value={gwConfig.stationConfig.stationURI} readonly/>
						    </div>
						    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
						    	<div class="input-group-shim font-extrabold text-lg w-48">Certification</div>
						    	<input name="stationCer" type="text" value={gwConfig.stationConfig.stationCer} readonly/>
						    </div>
						    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
						    	<div class="input-group-shim font-extrabold text-lg w-48">PrivateKey</div>
						    	<input name="stationKey" type="text" value={gwConfig.stationConfig.stationKey} readonly/>
						    </div>
                		{/if}
					</div>
                	</svelte:fragment>
                </TabGroup>
		</div>
	    <div class="card p-2 m-6 w-1/2 shadow-lime-50 variant-soft-tertiary">
	    	<div><p class="chip variant-filled-primary m-2 text-2xl"><b>Gateway Overview</b></p></div>
	    	<hr class="!border-t-2" /> <br />
	    	<div><p class="chip variant-filled-secondary m-2 text-xl">GreateAt :&nbsp<span class="variant-filled-success">{data.panelDocument['$createdAt']}</span></p></div>
	    	<div><p class="chip variant-filled-secondary m-2 text-xl">LastSeen :&nbsp<span class={lastSeen > 300000 ? "bg-red-500" : "bg-green-100"}>{data.panelDocument['$updatedAt']}</span></p></div>
	    	<div><p class="chip variant-filled-secondary m-2 text-xl">Uptime: {gwShadow.uptime ?? "None"}</p></div>
	    	<div><p class="chip variant-filled-secondary m-2 text-xl">OS: {gwShadow.osVersion ?? "None"}</p></div>
	    	<div><p class="chip variant-filled-secondary m-2 text-xl">FWD version: {gwShadow.fwdVersion ?? "None"} </p></div>
	    	<div><p class="chip variant-filled-secondary m-2 text-xl">GatewayIP: {gwShadow.gwIP ?? "None"} </p></div>
	    	<div><p class="chip variant-filled-secondary m-2 text-xl">Gateway Location: {gwShadow.gwLocation ?? "None"} </p></div>

	    	<div class="p-1 flex-row flex ml-8 mt-8">
	    		<div><ConicGradient stops={hardisk} legend>{gwShadow.hardisk[0].name + gwShadow.hardisk[0].total + " M (Hardisk)"}</ConicGradient></div>
	    		<div class="ml-12"><ConicGradient stops={memory} legend>{"Total " + gwShadow.memory.total + " M (Memory)"}</ConicGradient></div>
	    	</div>
	    </div>
    {:else}
    	<div class="card p-4 w-1/3">
    	</div>
    {/if}
</div>
