<script lang="ts">
	import type { Block, Group, Panel } from '$lib/config.builder';
	import type { EditInterface, EditPlaintext } from '$lib/config.interfaces';
	import type { Models } from 'appwrite';

	export let config: EditPlaintext;
	export let document: (any & Models.Document) | null;
	export let value: any | null;
	export let panel: Panel;
	export let group: Group;
	export let block: Block;
	export let ready = true;

	// Prevents compilation errors
	config; document; value; panel; group; block; ready;

	let inputValue = value;
	function onInput(e: any) {
		inputValue = e.target.value;
	}

	if(document === null && config.createValue) {
		inputValue = config.createValue;
	}
</script>

{#if block.editInterface.name === "status"}
	<input class="input p-3 border-2 variant-ghost-primary text-lg text-slate-500" 
			name={block.attribute}	
    		value="NotAtten"
			disabled="true"
			/>
{:else if block.editInterface.name === "gwModel"}
	<select class="input p-3 border-2 variant-ghost-primary text-lg text-slate-900" 
			name={block.attribute}
    		value={inputValue}
			>
	<option value="lg308" selected>LG308</option>
	<option value="lg308n">LG308N</option>
	<option value="lps8n">LPS8N</option>
	<option value="lps8v2">LPS8v2</option>
	<option value="dlos8n">DLOS8N</option>
	<option value="dlos8">DLOS8</option>
	<option value="hp0cin">HP0C</option>
	<option value="hp0aout">HP0A</option>
	<option value="hp0dout">HP0D</option>
	</select>
{:else if block.editInterface.name === "region"}
	<select class="input p-3 border-2 variant-ghost-primary text-lg text-slate-900" 
			name={block.attribute}
    		value={inputValue}
			>
	<option value="EU" selected>EU868</option>
	<option value="EU2">EU433</option>
	<option value="US">US915</option>
	<option value="CN">CN470</option>
	<option value="CN2">CN779</option>
	<option value="AU">AU923</option>
	<option value="AS1">AS923-1</option>
	<option value="AS2">AS923-2</option>
	<option value="AS3">AS923-3</option>
	<option value="KR">KR920</option>
	<option value="IN">IN865</option>
	<option value="RU">RU864</option>
	<option value="KZ">KZ</option>
	</select>
{:else if block.editInterface.name === "operate"}
	<select class="input p-3 border-2 variant-ghost-primary text-lg text-slate-900" 
			name={block.attribute}
    		value={inputValue}
			>
	<option value="deal" selected>Deal</option>
	<option value="hold">Hold</option>
	<option value="DONE">DONE</option>
	</select>
{:else if block.editInterface.name === "service"}
	<select class="input p-3 border-2 variant-ghost-primary text-lg text-slate-900" 
			name={block.attribute}
    		value={inputValue}
			>
	<option value="fwd" selected>fwd</option>
	<option value="station">station</option>
	<option value="chirpstack">chirpstack</option>
	</select>
{:else}
    <input
    	class={config.view}
    	type={config.type}
    	readonly={document !== null && config.editDisabled}
    	name={block.attribute}
    	value={inputValue}
    	on:input={onInput}
    	placeholder={config.placeholder}
    />
{/if}