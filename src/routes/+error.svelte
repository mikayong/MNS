<script lang="ts">
	import { page } from '$app/stores';
</script>

<div
	class="flex items-center justify-center w-screen h-screen overflow-y-auto bg-gradient-to-b"
>
	<div class="container flex flex-col items-center justify-center mx-auto space-y-4 ">
		<div class="relative w-full max-w-lg p-8 bg-white rounded-md  text-slate-900">
			<div class="mt-14">
				<h1 class="text-3xl font-semibold text-center text-black">Whoops!</h1>

				<div class="flex flex-col my-8 space-y-4">
					<p class="text-red-500 text-center">{$page.error?.message || 'Unknown error.'}</p>
					<p class="text-center"><a href='/app'><b>go back</b></a></p>
				</div>
			</div>
		</div>

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
	</div>
</div>
