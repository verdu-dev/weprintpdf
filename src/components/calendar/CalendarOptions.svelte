<script>
	import { DocOrientation, DocSize } from '@/lib/enums';
	import { createPDF } from '@/lib/pdf/base';
	import { calendarOptions } from '@/lib/stores';
	import { onMount } from 'svelte';

	onMount(createPDF);
	$: console.log($calendarOptions);
</script>

<aside class="flex flex-col gap-4 rounded-2xl bg-neutral-800 p-4 text-neutral-300 squircle">
	<label class="flex flex-col gap-1">
		<p>Año {$calendarOptions.year}</p>
		<input
			class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
			type="range"
			min="1900"
			max="2099"
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

	<label class="flex flex-col gap-1">
		<p>Marcar domingos</p>

		<select
			class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
			bind:value={$calendarOptions.sundays}
		>
			<option class="bg-neutral-900" value={true}>Si</option>
			<option class="bg-neutral-900" value={false}>No</option>
		</select>
	</label>

	<label class="flex flex-col gap-1">
		<p>Color fondo</p>

		<input class="w-full" type="color" bind:value={$calendarOptions.bgColor} />
	</label>

	<button
		class="mt-4 cursor-pointer rounded-lg bg-neutral-50 px-4 py-2 text-neutral-900"
		on:click={createPDF}
	>
		Generar calendario
	</button>
</aside>
