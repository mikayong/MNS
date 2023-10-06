<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppwriteService } from '$lib/appwrite';
	import { ID, Permission, Role } from 'appwrite';
	import Navbar from '$lib/components/navbar.svelte';
	import type { Group, Panel } from '$lib/config.builder';
	import { configStore } from '$lib/stores/config';
	import { authStore } from '$lib/stores/auth';
	import type { PageData } from './$types';
	import { EditInterface } from '$lib/config.interfaces';
	import { clipboard } from '@skeletonlabs/skeleton';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';


	export let data: PageData;

	let configSet: number = 0;

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

	let assignSN : string;
	let documentID: string;

	async function createGW(json: any) {
		let createNew;
		let id = ID.unique();
		let gwConfig: string = `{   "gwSN": "${json['gwSN']}",
									"gwID": "${json['gwID']}",
									"gwModel": "${json['gwModel']}",
									"gwRegion": "${json['gwRegion']}",
									"gwDesc": "${json['gwID']}",
									"statInterval": "${json['statInterval']}",
									"fwdConfig": {
										"servers":[
											{
										        "serverNmae": "${json['serverName']}",
										        "serverAddr": "${json['serverAddr']}",
										        "uplinkPort": "${json['uplinkPort']}",
										        "dnlinkPort": "${json['dnlinkPort']}",
										        "fportFilter": "${json['fportFilter']}",
										        "addrFilter": "${json['addrFilter']}" 
											}
										]
									},
									"stationConfig": {
										"stationURI": "${json['stationURI']}",
										"stationKey": "${json['stationKey']}",
										"stationCert": "${json['stationCert']}"
									}
		}`;

		gwConfig = gwConfig.replace(/\t/g, '').replace(/\s/g, '');

		if (panel.name == "Gateways") {
		    // update nmsMain
		    createNew = await AppwriteService.createDocument(
		    	panel.databaseId,
		    	'mnsMain',
		    	id,
		    	{	'gwSN': json['gwSN'], 'gwGroup': json['gwGroup'],
					'gwIsAssign': true,
					'userID': $authStore.$id
				},
				[
					Permission.read(Role.user($authStore.$id)),
					Permission.write(Role.user($authStore.$id)),
					Permission.delete(Role.user($authStore.$id)),
					Permission.update(Role.user($authStore.$id)),
					Permission.read(Role.user($authStore.$id))
				]
		    );

			documentID = createNew.$id;
			// update gwConfig
			try {
		    	//await AppwriteService.getDocument( panel.databaseId, 'gwConfig', createNew.$id );
		    	const document = await AppwriteService.listDocuments( panel.databaseId, 'gwConfig', 1, 1, [`"Query.equal('$id', ${createNew.$id})"`]);

				if (document.documents.length <= 0) { //createNew
				    await AppwriteService.createDocument( 
				    	panel.databaseId,
				    	'gwConfig',
				    	createNew.$id,
				    	{
				    		'gwSN': json['gwSN'],
				    		'userID': $authStore.$id,
				    		'gwConfig': gwConfig
				    	},
				        [
				        	Permission.read(Role.user($authStore.$id)),
				        	Permission.write(Role.user($authStore.$id)),
				        	Permission.delete(Role.user($authStore.$id)),
				        	Permission.update(Role.user($authStore.$id)),
				        	Permission.read(Role.user($authStore.$id))
				        ]
				    );

				} else {
			
				    await AppwriteService.updateDocument( 
				    	    panel.databaseId,
				    	    'gwConfig',
				    	    createNew.$id,
				    	    {
				    	    	'gwSN': json['gwSN'],
				    	    	'userID': $authStore.$id,
				    	    	'gwConfig': gwConfig
				    	    }
				    	)
				}
			} catch (err: any) {
				// nothing (todo)
			}

			// gwShadow
			try {
		    	//await AppwriteService.getDocument( panel.databaseId, 'gwShadow', createNew.$id );
		    	const document = await AppwriteService.listDocuments( panel.databaseId, 'gwShadow', 1, 1, [`"Query.equal('$id', ${createNew.$id})"`]);

				if (document.documents.length <= 0) {
				    await AppwriteService.createDocument( 
				    	panel.databaseId,
				    	'gwShadow',
				    	createNew.$id,
				    	{
				    		'gwSN': json['gwSN'],
				    		'userID': $authStore.$id,
				    		'gwShadow': `{"uptime": "none", "osVersion": "none", "kernel":"none", "fwdVersion":"none", "gwIP":"none", "gwLocation":"none",
          								  "hardisk":[{"name":"none", "total":100, "free":0}],
          								  "memory":{"total":100, "free":0, "cache":0},
          								  "service":[{"name":"fwd", "status":"none", "uptime":"none"},{"name":"station", "status":"none", "uptime":"none"}]
                                         }`
				    	},
				        [
				        	Permission.read(Role.user($authStore.$id)),
				        	Permission.write(Role.user($authStore.$id)),
				        	Permission.delete(Role.user($authStore.$id)),
				        	Permission.update(Role.user($authStore.$id)),
				        	Permission.read(Role.user($authStore.$id))
				        ]
				    );

				}
			
			} catch (err: any) {

				// nothing (todo)
			}

		}

	}


	async function onCreate(e: any) {
		const json: any = {};
		const formData = new FormData(e.target);
		for (let field of formData) {
			const key: any = field[0];
			let value: any = field[1];

			if (value == 'xempty' || key.startsWith('$')) {
				continue;
			}

			json[key] = value;
		}

		if (panel.name == "Gateways") {
			try {
			    await createGW(json);
			} catch (err: any) {
				// todo :  
			}
			goto(`/app/panels/${panel.slug}/view/${documentID}`);
		}

	}


</script>

<form on:submit|preventDefault={onCreate}>
	<Navbar title={'Add GateWay'} icon="🖋️">
		<div class="flex items-center justify-end space-x-4">
			<a href={`/app/panels/${panel.slug}`} class="flex items-center justify-center group">
				<div class="p-3 text-sm  text-primary-800 rounded-l-md group-hover:bg-primary-200 bg-primary-100">
					Discard
				</div>
				<div class="p-3  text-primary-800 rounded-r-md group-hover:bg-primary-300 bg-primary-200">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</a>

			<button type="submit" class="flex items-center justify-center group">
				<div class="p-3 text-sm text-white  group-hover:bg-primary-900 rounded-l-md bg-primary-800">
					Save
				</div>
				<div class="p-3 text-white  group-hover:bg-black rounded-r-md bg-primary-900">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"
						/>
						<path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
						<path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
					</svg>
				</div>
			</button>
		</div>
	</Navbar>
		
	<div class="flex flex-col relative mx-56">
	{#if panel.name == "Gateways"}
	<div class="mt-10 p-8">
		<div class="mx-10 my-4 px-2 py-4 w-2/3 text-3xl font-extrabold bg-primary-100"> General configure </div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md">
			<div class="input-group-shim font-extrabold text-lg w-48">GatewaySN</div>
			<input name="gwSN" type="text" value={assignSN ?? "None"} />
			<select bind:value={assignSN}>
				<option value="None">Select unassignGW</option>
				<option value="a840412219840501">un1</option>
				<option value="a840412219840502">un2</option>
				<option value="a840412219840503">un3</option>
			</select>
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
			<div class="input-group-shim font-extrabold text-lg w-48">GatewayID</div>
			<input name="gwID" type="text" placeholder="Enter gateway identify..." />
			<button class="variant-soft-tertiary ">Generate</button>
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
			<div class="input-group-shim font-extrabold text-lg w-48">Gateway group</div>
			<select name="gwGroup">
				<option value="all">ALL</option>
			</select>
		</div>				
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
			<div class="input-group-shim font-extrabold text-lg w-48">Gateway model</div>
			<select name="gwModel">
				<option value="lg308" selected>LG308</option>
				<option value="lg308n">LG308N</option>
				<option value="lps8n">LPS8N</option>
				<option value="lps8v2">LPS8v2</option>
				<option value="dlos8n">DLOS8N</option>
				<option value="dlos8">DLOS8</option>
				<option value="hp0cin">HP0C</option>
				<option value="hp0aout">HP0A</option>
				<option value="hp0dout">HP0D</option>
			</select>
		</div>				
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
			<div class="input-group-shim font-extrabold text-lg w-48">Gateway Region</div>
			<select name="gwRegion">
				<option value="EU" selected>EU868</option>
				<option value="EU2">EU433</option>
				<option value="US">US915</option>
				<option value="CN">CN470</option>
				<option value="CN2">CN779</option>
				<option value="AU">AU923</option>
				<option value="AS1">AS923-1</option>
				<option value="AS2">AS923-2</option>
				<option value="AS3">AS923-3</option>
				<option value="KR">KR920</option>
				<option value="IN">IN865</option>
				<option value="RU">RU864</option>
				<option value="KZ">KZ</option>
			</select>
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 w-2/3 rounded-md my-2">
			<div class="input-group-shim font-extrabold text-lg w-48">Description</div>
			<textarea class="textarea" name="gwDesc" rows="4" placeholder="Enter gateway description..." />
		</div>

		<div class="mx-10 my-4 mt-4 px-2 py-4 w-2/3 text-3xl font-extrabold bg-primary-100"> LoRaWan Configure </div>
		
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
							<input name="serverName" type="text" placeholder="Enter server name..." />
							<button class="variant-soft-tertiary ">Generate</button>
						</div>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
							<div class="input-group-shim font-extrabold text-lg w-48">Status interval</div>
							<input name="statusInterval" type="number" value="300" />
						</div>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
							<div class="input-group-shim font-extrabold text-lg w-48">Server addr</div>
							<input name="serverAddr" type="text" placeholder="Enter server address..." />
						</div>
						<div class="flex mx-10">
							<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] w-1/2 rounded-md my-2">
								<div class="input-group-shim font-extrabold text-lg w-28">UP port</div>
								<input name="uplinkPort" type="number" value="1700" />
							</div>
							<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] w-1/2 rounded-md my-2 ml-16">
								<div class="input-group-shim font-extrabold text-lg w-28">Down </div>
								<input name="uplinkPort" type="number" value="1700" />
							</div>
						</div>
						<div class="input-group-shim font-extrabold text-lg mx-10 my-2 p-1">Filter rule</div>
						<div class="flex mx-10">
							<input class="radio" type="radio" name="fportFilter" value="true" />
							<div class="font-thin">Enable Fport filter</div>
							<input class="ml-8 radio" type="radio" checked name="fportFilter" value="false" />
							<div class="font-thin">Disable Fport filter</div>
						</div>
						<div class="flex mx-10">
							<input class="radio" type="radio" name="addrFilter" value="true" />
							<div class="font-thin">Enable devaddr filter</div>
							<input class="ml-8 radio" type="radio" checked name="addrFilter" value="false" />
							<div class="font-thin">Disable devaddr filter</div>
						</div>
					{:else if configSet === 1}
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
							<div class="input-group-shim font-extrabold text-lg w-48">StationURI</div>
							<input name="stationURI" type="text" placeholder="Enter stationURI ..." />
						</div>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
							<div class="input-group-shim font-extrabold text-lg w-48">Certification</div>
							<input name="stationCer" type="text" placeholder="Enter certification..." />
						</div>
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mx-10 rounded-md my-2">
							<div class="input-group-shim font-extrabold text-lg w-48">PrivateKey</div>
							<input name="stationKey" type="text" placeholder="Enter private key..." />
						</div>
					{/if}
				</div>
				</svelte:fragment>
			</TabGroup>
	</div>
	{/if}  <!-- end if panel: gateways -->
	</div>
</form>
