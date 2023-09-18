import type { LayoutData } from './$types';
import { AppwriteService } from '$lib/appwrite';
import config from '$lib/config';
import { authStore } from '$lib/stores/auth';

export const ssr = false;

export const load: LayoutData = async () => {
	AppwriteService.setClient(config.endpoint, config.projectId);

	try {
		const account = await AppwriteService.getAccount();
		authStore.set(account);
	} catch(err) {
		authStore.set(null);
	}
};
