<script lang="ts">
	import { onMount } from 'svelte';
	import { DocOrientation, DocSize } from '@/lib/enums';
	import { createAnual, createAnualMultipage } from '@/lib/pdf/calendar';
	import { bloburi, calendarOptions } from '@/lib/stores';

	const allYears = Array.from({ length: 10000 }, (_, i) => i);

	$: printCalendar = $calendarOptions.multipage ? createAnualMultipage : createAnual;
	/* let logo: FileList | null = null;

	$: if (logo && logo.length > 0) {
		const file = logo[0];
		const reader = new FileReader();
		const fileType = file.type;
		const [_, format] = fileType.split('/');

		reader.onload = (e) => {
			const dataUrl = e.target?.result as string;
			const img = new Image();

			img.onload = () => {
				const aspectRatio = img.height / img.width;

				$calendarOptions.logo = {
					img,
					format,
					aspectRatio
				};
			};

			img.src = dataUrl;
		};

		reader.readAsDataURL(file);
	} */

	onMount(printCalendar);
	$: ($calendarOptions, printCalendar());

	function downloadPDF() {
		const blobUrl = $bloburi;
		const link = document.createElement('a');
		link.href = blobUrl;
		link.download = `calendario-${$calendarOptions.year}.pdf`;
		link.click();
	}

	/* function removeLogo() {
		$calendarOptions.logo = null;
		logo = null;
	} */
</script>

<aside
	class="flex flex-col gap-4 overflow-y-auto border border-neutral-300 bg-brown-50 p-6 scrollbar-none"
>
	<form class="contents" on:submit|preventDefault={printCalendar}>
		<label class="flex flex-col gap-1">
			<p class="text-sm font-medium">Año</p>

			<input
				class="w-full bg-brown-200 px-3 py-2 text-lg outline-none"
				type="number"
				list="years"
				maxlength="4"
				bind:value={$calendarOptions.year}
			/>

			<datalist id="years">
				{#each allYears as year}
					<option value={year}>{year}</option>
				{/each}
			</datalist>
		</label>

		<div class="grid grid-cols-2 gap-4">
			<label class="flex flex-col gap-1">
				<p class="text-sm font-medium">Tamaño</p>

				<select
					class="w-full appearance-none bg-brown-200 px-3 py-2 text-lg uppercase outline-none"
					bind:value={$calendarOptions.size}
				>
					{#each Object.values(DocSize) as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			</label>

			<label class="flex flex-col gap-1">
				<p class="text-sm font-medium">Orientación</p>

				<select
					class="w-full appearance-none bg-brown-200 px-3 py-2 text-lg outline-none"
					bind:value={$calendarOptions.orientation}
				>
					{#each Object.values(DocOrientation) as value}
						<option {value}>{value === DocOrientation.LANDSCAPE ? 'Apaisado' : 'Vertical'}</option>
					{/each}
				</select>
			</label>
		</div>

		<label class="flex flex-col gap-1">
			<p class="text-sm font-medium">Multipágina</p>

			<select
				class="w-full appearance-none bg-brown-200 px-3 py-2 text-lg outline-none"
				bind:value={$calendarOptions.multipage}
			>
				<option value={true}>Si</option>
				<option value={false}>No</option>
			</select>
		</label>

		<div class="grid grid-cols-2 gap-4">
			<label class="flex flex-col gap-1">
				<p class="text-sm font-medium">Marcar domingos</p>

				<select
					class="w-full appearance-none bg-brown-200 px-3 py-2 text-lg outline-none"
					bind:value={$calendarOptions.sundays}
				>
					<option value={true}>Si</option>
					<option value={false}>No</option>
				</select>
			</label>

			<label class="flex flex-col gap-1">
				<p class="text-sm font-medium">Marcar festivos</p>

				<select
					class="w-full appearance-none bg-brown-200 px-3 py-2 text-lg outline-none"
					bind:value={$calendarOptions.holidays}
				>
					<option value={true}>Si</option>
					<option value={false}>No</option>
				</select>
			</label>
		</div>

		{#if $calendarOptions.holidays && $calendarOptions.multipage}
			<label class="flex flex-col gap-1">
				<p class="text-sm font-medium">Etiquetar festivos</p>

				<select
					class="w-full appearance-none bg-brown-200 px-3 py-2 text-lg outline-none"
					bind:value={$calendarOptions.labelHolidays}
				>
					<option value={true}>Si</option>
					<option value={false}>No</option>
				</select>
			</label>
		{/if}

		<!-- <label class="flex flex-1 flex-col gap-1">
			<p class="text-sm font-medium">Logotipo</p>

			<input
				class="w-full appearance-none bg-brown-200 px-3 py-2 text-lg outline-none"
				type="file"
				accept="image/png, image/jpeg, image/webp"
				bind:files={logo}
			/>
		</label>

		{#if $calendarOptions.logo}
			<button class=" bg-white px-3 py-2 text-black" type="button" on:click={removeLogo}>
				Borrar
			</button>
		{/if} -->

		<button
			class="mt-4 cursor-pointer bg-neutral-900 px-4 py-2 text-neutral-100"
			type="button"
			on:click={downloadPDF}
		>
			Descargar PDF
		</button>
	</form>
</aside>
