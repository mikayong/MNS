import { AppwriteService } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { PageUtils } from '$lib/utils';
import { authStore } from '$lib/stores/auth';
import { get } from 'svelte/store';

export const ssr = false

export const load: PageLoad = async ({ params, url, parent }) => {
	await parent();
	
	const { panel, group } = PageUtils.parseParams("64895f70d9a400b1b039");

	try {
		const limit = +(url.searchParams.get('limit') ?? '10');
		const page = +(url.searchParams.get('page') ?? '1');
		const label = url.searchParams.get('label') ?? '';
		const query = [];
		const userQuery = 'equal("userID",'  + get(authStore).$id + ')';
		query.push(userQuery);	

		const documents = await AppwriteService.listDocuments<any>(
			panel.databaseId,
			panel.collectionId,
			limit,
			(page - 1) * limit,
			query
		);

		return {
			panelDocuments: documents,
			panelLabel: label,
			panelLimit: limit,
			panelPage: page,

			panelSlug: "64895f70d9a400b1b039",
			group,
			panel
		};
	} catch (err: any) {
		throw error(500, { message: 'Could not load element: ' + err.message });
	}
};
