import { AppwriteService } from '$lib/appwrite';
import { PageUtils } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { Models } from 'appwrite';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { panel, group } = PageUtils.parseParams(params.panelSlug);

	const id = params.documentId;

	if (!id) {
		throw error(404, { message: 'Gateway not found.' });
	}

	try {
		const document = await AppwriteService.getDocument<any & Models.Document>( panel.databaseId, panel.collectionId, id);

		const config = await AppwriteService.getDocument<any & Models.Document>( panel.databaseId, 'gwConfig', id);

		const shadow = await AppwriteService.getDocument<any & Models.Document>( panel.databaseId, 'gwShadow', id);

		return {
			panelDocument: document,
			panelSlug: params.panelSlug,
			gwConfig: config,
			gwShadow: shadow,
			group,
			panel
		};

	} catch (err: any) {
		throw error(500, { message: err.message });
	}
};
