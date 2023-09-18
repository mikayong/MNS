<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppwriteService } from '$lib/appwrite';
	import { configStore } from '$lib/stores/config';

	let email = '';
	let password  = '';
	let passwordConfirm = '';

	let formMsg = '';

	async function onSignupSubmit() {
		try {
			await AppwriteService.createAccount(email, password);
			goto('/auth/login');
		} catch(err: any) {
			formMsg = err.message;
		}
	}
</script>

<div
	class="flex items-center justify-center w-screen h-screen overflow-y-auto bg-gradient-to-b"
>
	<div class="container flex flex-col items-center justify-center mx-auto space-y-4 ">
		<div class="relative w-full max-w-lg p-8 pb-2">
			<div class="absolute left-0 flex justify-center w-full -top-12">
				<div
					class="justify-center flex items-center text-[60px] bg-primary-50 shadow-md border-8 w-28 h-28 rounded-xl border-white "
				>
					{$configStore.icon}
				</div>
			</div>

			<div class="mt-14">
				<h1 class="text-3xl font-semibold text-center text-black">{$configStore.name}</h1>

				<form on:submit|preventDefault={onSignupSubmit} class="flex flex-col my-8 space-y-4">
					<input
						bind:value={email}
						class="p-4 bg-white border-4 rounded-md  border-primary-200 focus:outline-none focus:ring ring-gray-600"
						type="text"
						placeholder="E-mail"
						autocomplete="email"
					/>
					<input
						bind:value={password}
						required={true}
						class="p-4 bg-white border-4 rounded-md  border-primary-200 focus:outline-none focus:ring ring-gray-600"
						type="password"
						placeholder="YourPassword"
					/>
					<input
						bind:value={passwordConfirm}
						required={true}
						class="p-4 bg-white border-4 rounded-md  border-primary-200 focus:outline-none focus:ring ring-gray-600"
						type="password"
						placeholder="RepeatPassword"
					/>
					<button
						type="submit"
						class="flex items-center justify-center p-4 space-x-3 text-lg font-semibold border-4 rounded-md  bg-primary-900 text-primary-50 border-primary-900 focus:outline-none focus:ring ring-gray-600"
					>
						<span>SignUP</span>
					</button>

					{#if formMsg}
						<p class="text-red-500 text-center">{formMsg}</p>
					{/if}

				</form>
			</div>
		</div>

		<div class="text-center text-primary-300">
			<p>
				Copyright © 2023
				<a
					href="http://www.dragino.com"
					rel="noreferrer"
					class="text-primary-300 hover:underline"
					target="_blank">Dragino Gateway Manager</a
				>
				v0.1.0
			</p>
		</div>
	</div>
</div>
