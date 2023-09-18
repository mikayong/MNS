<script lang="ts">
	import { configStore } from "$lib/stores/config";
	import { page } from '$app/stores';

    let homeLink: string = '/app/dashboard';
    let settingLink: string = '/app/settings';

	let gwLink: string = `/app/panels/${$configStore.groups[0].panels[0].slug}`
	let memberLink: string = `/app/panels/${$configStore.groups[1].panels[0].slug}`
	let orgLink: string = `/app/panels/${$configStore.groups[1].panels[1].slug}`

	$: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-primary-200' : '');

</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href={orgLink} class="{classesActive(orgLink)}">Organizations</a></li>
		<hr class="!border-t-4" /> <br />
		<li><a href={homeLink} class="{classesActive(homeLink)}">
			<span>
				<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					<path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"/>
				</svg>
			</span>
			<span class="flex-auto">Dashbord</span>
		</a></li>
		<li><a href={gwLink} class="{classesActive(gwLink)}">
			<span class="badge bg-primary-500"></span>
		  <span class="flex-auto">Gateways</span>
		</a></li>
		<li><a href={memberLink} class="{classesActive(memberLink)}">
			<span class="badge bg-primary-500"></span>
			<span class="flex-auto">Groups</span>
		</a></li>
		<li><a href={settingLink} class="{classesActive(settingLink)}">
			<span class="badge bg-primary-500"></span>
			<span class="flex-auto">Configs</span>
		</a></li>
	</ul>
</nav>