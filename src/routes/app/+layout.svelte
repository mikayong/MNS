<script lang="ts">
  	import { afterNavigate, goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { storePreview, storeTheme } from '$lib/stores/theme';
	import { AppwriteService } from '$lib/appwrite';

	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  	import Navigation from '$lib/navigation/navigation.svelte';
	import { browser } from '$app/environment';

	// icons
	import Icon from '@iconify/svelte';
	import logoutIcon from '@iconify/icons-tabler/logout';
	import { Avatar } from '@skeletonlabs/skeleton';

	// Types
	import type { ModalComponent } from '@skeletonlabs/skeleton';

    // Components & Utilities
    import { AppShell, AppBar, Modal, Toast, initializeStores, prefersReducedMotionStore } from '@skeletonlabs/skeleton';
    initializeStores();

	import ModalExampleList from '$lib/components/ModalExampleList.svelte';
	import Chpass from '$lib/components/chpass.svelte';

	const modalComponentRegistry: Record<string, ModalComponent> = {
		modalList: {ref: ModalExampleList},
		modalChpass: {ref: Chpass}
	};


	// Set body `data-theme` based on current theme status
	storePreview.subscribe(setBodyThemeAttribute);
	storeTheme.subscribe(setBodyThemeAttribute);
	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storePreview ? 'generator' : $storeTheme);
	}

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

	let firstName: string;
	let myName: string = $authStore.name;
	
	if (myName.length > 2) {
		firstName = myName.slice(0,2);
	} else {
		firstName = 'NO';
	}

	$: allyPageSmoothScroll = !$prefersReducedMotionStore ? 'scroll-smooth' : '';

</script>

<svelte:head>
	<title>DraginoMNS</title>
	<!-- Meta Tags -->
	<meta name="title" content="DraginoMNS" />
	<meta name="description" content="dragino gateways manager" />
	<meta name="keywords" content="lora, lorawan, ttn, semtech, thethingsnetworking, dragon, gateway" />
	<meta name="theme-color" content="#242c46" />
	<meta name="author" content="Dragino Labs" />
	<!-- Open Graph - https://ogp.me/ -->
	<meta property="og:site_name" content="DraginoMNS" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.dragino.com" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content="DraginoMNS" />
	<meta property="og:description" content="dragino gateways manager" />
	<meta property="og:image" content="" />
	<meta property="og:image:secure_url" content="" />
	<meta property="og:image:type" content="image/jpg" />
	<meta property="og:image:width" content="1707" />
	<meta property="og:image:height" content="1233" />
</svelte:head>

<Modal components={modalComponentRegistry} />
<Toast />

<!-- App Shell -->
 <AppShell scrollGutter="auto" slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64" regionPage={allyPageSmoothScroll}>
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
				<button use:popup={popupCombobox}>
					<Avatar initials={firstName} background="bg-primary-500"/>
				</button>
				<div class="card w-28 shadow-xl p-2 py-2 bg-primary-100" data-popup="popupCombobox">
					<button class="btn hover:variant-soft-primary" on:click={onLogout}>
						<Icon icon={logoutIcon} />
						Logout
					</button>
					<div class="arrow bg-surface-100-800-token" />
				</div>

				<!--
				<button class="btn variant-soft-secondary w-48 justify-between" use:popup={popupCombobox}>
					<span>↓</span>
				</button>
				<div class="card w-48 shadow-xl py-2 bg-primary-100" data-popup="popupCombobox">
					<button class="btn">Passwd</button>
					<button class="btn" on:click={onLogout}>Logout</button>
					<div class="arrow bg-surface-100-800-token" />
				</div>
				<div class="card shadow-xl py-2 bg-primary-100" data-popup="popupChpass">
                    <form class="form-input border border-surface-500 p-4 space-y-4 rounded-container-token">
						<span class="px-1">Old password</span>
                    	<input class="input" type="password" placeholder="Old Password" />
						<span class="px-1">New password</span>
                    	<input class="input" type="password" placeholder="New password" />
						<span class="px-1">New password again</span>
                    	<input class="input" type="password" placeholder="Detect" />
                    	<button class="btn variant-filled-success">Submit</button>
						<button id="will-close" class="btn variant-filled-success">Cancel</button>
                    </form>

					<div class="arrow bg-surface-100-800-token" />
				</div>
				-->
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

