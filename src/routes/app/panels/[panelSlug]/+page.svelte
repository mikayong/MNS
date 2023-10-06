<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import type { Group, Panel } from '$lib/config.builder';
	import { configStore } from '$lib/stores/config';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { AppwriteService } from '$lib/appwrite';
	import type { Models } from 'appwrite';
	import { invalidateAll } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	export let data: PageData;

	function parseQuery(queryString: string) {
		var query: any = {};
		var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');

		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split('=');
			if (pair.length >= 2) {
				query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
			}
		}
		return query;
	}

	$: search = $page.url.search;

	function getSearch(search: string, key: string, value: string) {
		const query = parseQuery(search);

		query[key] = value;

		let newQuery = '?';

		let i = 0;
		for (const queryKey in query) {
			newQuery += `${i === 0 ? '' : '&'}${queryKey}=${query[queryKey]}`;
			i++;
		}

		return newQuery;
	}

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

	let firstPage: number;
	let lastPage: number;
	let pages: number[];

	$: {
		firstPage = 1;
		lastPage = Math.ceil(data.panelDocuments.total / data.panelLimit);
		const currentPage = data.panelPage;

		pages = [];

		let middlePages = [];
		middlePages.push(currentPage - 1);
		middlePages.push(currentPage + 1);
		middlePages.push(currentPage);
		middlePages = middlePages.filter((p) => p > firstPage && p < lastPage);
		middlePages = middlePages.sort((a, b) => (a < b ? -1 : 1));

		pages.push(firstPage);
		if (middlePages[0] !== firstPage + 1) {
			pages.push(-1);
		}
		pages.push(...middlePages);
		if (middlePages[middlePages.length - 1] !== lastPage - 1) {
			pages.push(-1);
		}
		pages.push(lastPage);

		if (middlePages.length === 0) {
			pages = [firstPage, lastPage];
		}

		if (firstPage === lastPage) {
			pages = [firstPage];
		}
	}

	async function onDelete(panel: Panel, document: Models.Document) {
		if (confirm('Are you sure to delete?')) {
			try {
			    await AppwriteService.deleteDocument(panel.databaseId, panel.collectionId, document.$id);
			    await AppwriteService.deleteDocument(panel.databaseId, 'gwConfig', document.$id);
			    await AppwriteService.deleteDocument(panel.databaseId, 'gwShadow', document.$id);
			} catch (err: any) {

			}
			await invalidateAll();
		}
	}

	async function onLabelFilter() {
		if (panel.labels.length > 0) {
			panel.labels.forEach((label) => {
				if (label.queries.length > 0) {
					$page.url.searchParams.set('label', label.name);
					goto(`?${$page.url.searchParams.toString()}`);
				} else {
					invalidateAll();
					goto(`/app/panels/${panel.slug}`);
				}
			})
		}
	}

	AppwriteService.subscribe('documents', invalidateAll);

</script>

<Navbar
	subtitle={panel.subtitle}
	title={panel.name}
	icon={panel.icon}
	description={panel.description}
>
<!----------------------------------------------- start create button ------------------------------------------------------->
	<div class="flex items-center justify-end space-x-4">
		{#if panel.createEnabled}
			<a href={`/app/panels/${panel.slug}/create`} class="flex items-center justify-center group">
				<div class="p-3 text-sm text-white  rounded-l-md bg-primary-800 group-hover:bg-primary-900">
					Create
				</div>
				<div class="p-3 text-white  group-hover:bg-primary-800 rounded-r-md bg-primary-900">
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
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</div>
			</a>
		{/if}
	</div>
</Navbar>

<!----------------------------------------------- start search lable ------------------------------------------------------->

<div class="p-4 text-base">
	{#if panel.labels.length > 0}
		<div class="w-full text-md">
				<form on:submit|preventDefault={onLabelFilter}> 
					{#each panel.labels as label (label.slug)}
						<div class="input-group grid-cols-[auto_1fr_auto] w-96">
                    		<div class="input-group-shim">(icon)</div>
                        	<input type="search" bind:value={label.queries} placeholder="GWID..." />
                        	<button class="variant-soft-secondary">Search</button>
                        </div>
					{/each}
				</form>
		</div>
	{/if}

<!-----------------------------------------------end search lable ------------------------------------------------------->
	<div>
		{#if data.panelDocuments.documents.length <= 0}
			{#if panel.name == "Profile"}
				<div class="bg-primary-200 border-2 border-primary-200 rounded-md p-6">
					<p class="text-slate-900 text-bg">username: {$authStore.name}  </p>
					<p class="text-slate-900 text-bg">email:    {$authStore.email} </p>
					<p class="text-slate-900 text-bg">phone:    {$authStore.phone} </p>
					<p class="text-slate-900 text-bg">registration:    {$authStore.registration} </p>

				</div>
			{:else}
				<div class="bg-primary-200 border-2 border-primary-200 rounded-md p-6">
					<p class="text-primary-600 text-center">There are no element.</p>
				</div>
			{/if}
		{:else}
		    <p class="mb-2 text-sm text-right text-primary-500 my-2">
		    	{data.panelDocuments.total}{data.panelDocuments.total >= 5000 ? '+' : ''}
		    	{data.panelDocuments.total === 1 ? 'element' : 'elements'} found
		    </p>
			<div class="overflow-y-auto border-2 rounded-md border-primary-900">
				<table class="relative w-full overflow-hidden border-collapse table-fixed table-hover">
					<thead class="border-b-2 border-primary-800">
						<tr>
							<td
								class="
					  border-r-2 border-primary-800
					  bg-primary-900
					  py-2
					  px-4
					  text-white
					  font-semibold
					  w-[140px]
					"
							>
								Actions
							</td>

							{#each panel.blocks as block}
								{#if block.listInterface}
									<td
										style={`width: ${block.listInterface.width}`}
										class="px-4 py-2 font-semibold text-white border-r-2  border-primary-800 bg-primary-900"
									>
										{block.listInterface.name}
									</td>
								{/if}
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each data.panelDocuments.documents as document, i (document.$id)}
							<tr class={`${i % 2 === 0 ? 'bg-white' : 'bg-primary-100'}`}>
								<td class="flex items-center justify-start px-4 py-4 space-x-1">
									<a href={`/app/panels/${panel.slug}/view/${document.$id}`}
										><button
											class="p-2 rounded-md  bg-primary-200 text-primary-800 hover:bg-primary-300 "
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="w-4 h-4"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
												<path
													fill-rule="evenodd"
													d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
													clip-rule="evenodd"
												/>
											</svg></button
										></a
									>

									{#if panel.editEnabled}
										<a href={`/app/panels/${panel.slug}/edit/${document.$id}`}>
											<button class="p-2 rounded-md  bg-primary-900 text-primary-50 hover:bg-black">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="w-4 h-4"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
													/>
												</svg></button
											></a
										>
									{/if}

									{#if panel.deleteEnabled}
										<button
											on:click={() => onDelete(panel, document)}
											type="button"
											class="p-2 rounded-md text-red-800 bg-red-200 rounded-mdp hover:bg-red-300"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="w-4 h-4"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
									{/if}
								</td>

								{#each panel.blocks as block}
									{#if block.listInterface}
										{@const value = document[block.attribute]}
										{@const lastSeen = Date.now() - Date.parse(document['$updatedAt'])}

										<td class="px-4 py-4 text-slate-900">
											<svelte:component
												this={block.listInterface.element}
												config={block.listInterface}
												{panel}
												{group}
												{block}
												{document}
												{value}
												{lastSeen}
											/>
										</td>
									{/if}
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	{#if data.panelDocuments.documents.length > 0}
	<div class="flex items-start justify-between mt-6">
		<div class="flex flex-col space-y-2">
			<p class="text-sm text-primary-500">Results per page:</p>

			<div class="flex space-x-1">
				{#each [1, 10, 25, 50, 100] as limit}
					<a
						href={getSearch(search, 'limit', limit.toString())}
						class={`p-1 px-3 rounded-md ${
							data.panelLimit === limit ? 'bg-primary-900 text-white' : 'bg-primary-200 text-primary-900'
						}`}>{limit}</a
					>
				{/each}
			</div>
		</div>

		<div class="flex flex-col space-y-2 items-end">
			<p class="text-sm text-primary-500 text-right">Pages:</p>

			<div class="flex space-x-1">
				{#each pages as page}
					{#if page === -1}
						<p class="text-primary-400 font-bold">...</p>
					{:else}
						<a
							href={getSearch(search, 'page', page.toString())}
							class={`p-1 px-3 rounded-md ${
								data.panelPage === page ? 'bg-primary-900 text-white' : 'bg-primary-200 text-primary-900'
							}`}>{page}</a
						>
					{/if}
				{/each}
			</div>
		</div>
	</div>
	{/if}

</div>
