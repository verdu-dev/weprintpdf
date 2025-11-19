<script>
	import { DocOrientation, DocSize } from '@/lib/enums';
	import { createPDF } from '@/lib/pdf/base';
	import { calendarOptions } from '@/lib/stores';
	import { onMount } from 'svelte';

	onMount(createPDF);
</script>

<aside class="flex flex-col gap-4 rounded-2xl bg-neutral-800 p-4 text-neutral-300 squircle">
	<label class="flex flex-col gap-1">
		<p>Año</p>
		<input
			class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
			type="text"
			bind:value={$calendarOptions.year}
		/>
	</label>

	<label class="flex flex-col gap-1">
		<p>Tamaño</p>

		<select
			class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
			bind:value={$calendarOptions.size}
		>
			{#each Object.values(DocSize) as value}
				<option class="bg-neutral-900" {value}>{value}</option>
			{/each}
		</select>
	</label>

	<label class="flex flex-col gap-1">
		<p>Orientación</p>

		<select
			class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
			bind:value={$calendarOptions.orientation}
		>
			{#each Object.values(DocOrientation) as value}
				<option class="bg-neutral-900" {value}>{value}</option>
			{/each}
		</select>
	</label>

	<button
		class="mt-4 cursor-pointer rounded-lg bg-neutral-50 px-4 py-2 text-neutral-900"
		on:click={createPDF}
	>
		Generar calendario
	</button>
</aside>
