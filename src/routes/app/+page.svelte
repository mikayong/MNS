<script>
	import { configStore } from "$lib/stores/config";
</script>

<div class="container p-10 space-y-4">
	<h1>welcome</h1>
	<hr />
	<p> {$configStore.dashboard.motd} </p>
</div>