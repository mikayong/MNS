<script lang="ts">
	import { configStore } from "$lib/stores/config";
	import { page } from '$app/stores';
	import { authStore } from "$lib/stores/auth";

	import Icon from '@iconify/svelte';
	import userIcon from '@iconify/icons-bx/user';
	import dashboardIcon from '@iconify/icons-uiw/dashboard';
	import gatewayIcon from '@iconify/icons-carbon/gateway';
	import group24Regular from '@iconify/icons-fluent/group-24-regular';
	import configureIcon from '@iconify/icons-grommet-icons/configure';


    let homeLink: string = '/app/dashboard';
    let settingLink: string = '/app/settings';
    let userLink: string = '/app/userinfo';

	let gwLink: string = `/app/panels/${$configStore.groups[0].panels[0].slug}`
	let groupLink: string = `/app/panels/${$configStore.groups[1].panels[0].slug}`

	$: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-primary-200' : '');

</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href={userLink} class="{classesActive(userLink)}">
		  	<Icon icon={userIcon} />
		  	<span class="flex-auto">Your Information</span>
		</a></li>
		<hr class="!border-t-4" /> <br />
		<li><a href={homeLink} class="{classesActive(homeLink)}">
			<Icon icon={dashboardIcon} />
			<span class="flex-auto">Dashboard</span>
		</a></li>
		<li><a href={gwLink} class="{classesActive(gwLink)}">
			<Icon icon={gatewayIcon} />
		  	<span class="flex-auto">Gateways</span>
		</a></li>
		<li><a href={groupLink} class="{classesActive(groupLink)}">
			<Icon icon={group24Regular} />
			<span class="flex-auto">Groups</span>
		</a></li>
		<li><a href={settingLink} class="{classesActive(settingLink)}">
			<Icon icon={configureIcon} />
			<span class="flex-auto">Configs</span>
		</a></li>
	</ul>
</nav>