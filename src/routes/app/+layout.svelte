<script lang="ts">
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
  	import Navigation from '$lib/navigation/navigation.svelte';
  	import { afterNavigate, goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { AppwriteService } from '$lib/appwrite';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { storePopup } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  
  	afterNavigate((params: any) => {
        const isNewPage: boolean = params.from && params.to && params.from.route.id !== params.to.route.id;
        const elemPage = document.querySelector('#page');
        if (isNewPage && elemPage !== null) {
            elemPage.scrollTop = 0;
      }
  	});

	async function onLogout() {
		await AppwriteService.logout();
		authStore.set(null);
		goto('/auth/login');
	}

    let comboboxValue: string;

    const popupCombobox: PopupSettings = {
    	event: 'click',
    	target: 'popupCombobox',
    	placement: 'bottom',
    	closeQuery: '.listbox-item'
    };

</script>

<!-- App Shell -->
 <AppShell scrollGutter="auto" slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
		<!-- App Bar -->
	<AppBar>
      <svelte:fragment slot="lead">
        <div class="flex items-center">
            <button class="p-2 rounded-md hover:bg-primary-300">
                <span>
                    <svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
                        <rect width="100" height="20" />
                        <rect y="30" width="100" height="20" />
                        <rect y="60" width="100" height="20" />
                    </svg>
                </span>
            </button>
            <strong class="text-xl uppercase">DraginoMNS</strong>
        </div>
      </svelte:fragment>
			<svelte:fragment slot="trail">
				<button class="btn variant-soft-secondary w-48 justify-between" use:popup={popupCombobox}>
						<svg fill="none" height="24" 
							stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
							viewBox="0 0 24 24" width="24" 
							xmlns="http://www.w3.org/2000/svg">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
							<circle cx="12" cy="7" r="4"/>
						</svg>
					<span>{comboboxValue ?? $authStore.name}</span>
					<span>↓</span>
				</button>
				<div class="card w-48 shadow-xl py-2 bg-primary-100" data-popup="popupCombobox">
					<ListBox rounded="rounded-none">
						<ListBoxItem bind:group={comboboxValue} name="medium" value="chpasswd">Passwd</ListBoxItem>
						<ListBoxItem bind:group={comboboxValue} name="medium" value="logout" on:click={onLogout}>Logout</ListBoxItem>
					</ListBox>
					<div class="arrow bg-surface-100-800-token" />
				</div>
			</svelte:fragment>
	</AppBar>
	</svelte:fragment>
  <svelte:fragment slot="sidebarLeft">
    <Navigation />
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
  <svelte:fragment slot="pageFooter">
	<div class="text-center text-slate-600">
		<p>
			Copyright © 2023
			<a
				href="http://www.dragino.com"
				rel="noreferrer"
				class="text-slate-300 hover:underline"
				target="_blank">Dragino Gateway Manager</a
			>
			v0.1.0
		</p>
	</div>
  </svelte:fragment>
</AppShell>

