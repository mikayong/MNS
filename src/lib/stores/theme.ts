import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Theme Generator Live Preview State
export const storePreview = writable(false);
export const storeTheme = writable(browser ? document.body.getAttribute('data-theme') ?? '' : 'skeleton');