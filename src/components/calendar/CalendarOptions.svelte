<script lang="ts">
	import { onMount } from 'svelte';
	import { DocOrientation, DocSize } from '@/lib/enums';
	import { createAnual, createAnualMultipage } from '@/lib/pdf/calendar';
	import { bloburi, calendarOptions, availableHolidays } from '@/lib/stores';
	import { debounce } from '@/lib/utils';

	import loadImage from 'blueimp-load-image';
	import Page from '@/lib/icons/Page.svelte';
	import Pages from '@/lib/icons/Pages.svelte';
	import ImageUploader from '@/components/ImageUploader.svelte';
	import Button from '@/components/Button.svelte';
	import OutlineRow from '@/components/OutlineRow.svelte';

	$: printCalendar = $calendarOptions.multipage ? createAnualMultipage : createAnual;
	$: calendarStyle = $calendarOptions.cover
		? 'cover'
		: $calendarOptions.multipage
			? 'multipage'
			: 'single';

	$: if (calendarStyle === 'single') {
		$calendarOptions.cover = false;
		$calendarOptions.multipage = false;
		printCalendar = createAnual;
	} else if (calendarStyle === 'multipage') {
		$calendarOptions.cover = false;
		$calendarOptions.multipage = true;
		printCalendar = createAnualMultipage;
	} else if (calendarStyle === 'cover') {
		$calendarOptions.cover = true;
		$calendarOptions.multipage = true;
		printCalendar = createAnualMultipage;
	}

	let images: (FileList | null)[] = Array.from({ length: 12 }, () => null);

	$: if (images && images.length > 0) {
		for (let i = 0; i < images.length; i++) {
			const file = images[i]?.[0];
			if (!file) continue;

			const reader = new FileReader();
			const fileType = file.type;
			const [_, format] = fileType.split('/');

			reader.onload = (ev) => {
				const dataUrl = ev.target?.result as string;
				const img = new Image();

				img.onload = async () => {
					const aspectRatio = img.height / img.width;

					let { image } = await loadImage(file, {
						canvas: true,
						orientation: true,
						maxWidth: 1440,
						maxHeight: 1440,
						upscale: false
					});

					const imgEl = new Image();
					imgEl.src = image.toDataURL();

					const monthImage = {
						img: imgEl,
						format,
						aspectRatio,
						monthIndex: i
					};

					$calendarOptions.images[i] = monthImage;
				};

				img.src = dataUrl;
			};

			reader.readAsDataURL(file);
		}
	}

	onMount(() => printCalendar());
	$: if ($calendarOptions) debounce(() => printCalendar(), 500)();

	function removeImage(monthIndex: number) {
		$calendarOptions.images[monthIndex] = null;
		images[monthIndex] = null;
	}

	function downloadPDF() {
		const blobUrl = $bloburi;
		const link = document.createElement('a');
		link.href = blobUrl;
		link.download = `calendario-${$calendarOptions.year}.pdf`;
		link.click();
	}

	function incYear() {
		const yearNum = Number($calendarOptions.year);
		const yearInc = yearNum + 1;
		$calendarOptions.year = yearInc.toString();
	}

	function decYear() {
		const yearNum = Number($calendarOptions.year);
		const yearDec = yearNum - 1;
		$calendarOptions.year = yearDec.toString();
	}
</script>

<aside
	class="overflow-y-auto rounded-2xl border border-neutral-300 bg-brown-50 p-1.5 scrollbar-none squircle dark:border-neutral-700 dark:bg-neutral-900"
>
	<form
		class="flex flex-1 flex-col gap-4 rounded-xl border border-neutral-300 py-4 squircle dark:border-neutral-700"
		on:submit|preventDefault={printCalendar}
	>
		<label class="flex flex-col gap-1">
			<p class="px-8 text-sm font-medium">Año</p>

			<OutlineRow className="px-4 gap-2 flex">
				<Button className="grow" type="button" onclick={decYear}>-</Button>

				<input
					class="w-1/2 appearance-none rounded-full bg-neutral-300 px-4 py-2 text-lg dark:bg-neutral-700"
					type="number"
					maxlength="4"
					bind:value={$calendarOptions.year}
				/>

				<Button className="grow" type="button" onclick={incYear}>+</Button>
			</OutlineRow>

			{#if !$availableHolidays}
				<p class="px-8 text-xs text-red-500">No hay fesitvos disponibles para este año</p>
			{/if}
		</label>

		<div class="grid grid-cols-2">
			<label class="flex flex-col gap-1">
				<p class="px-8 text-sm font-medium">Tamaño</p>

				<OutlineRow className="px-4">
					<select
						class="w-full appearance-none rounded-full bg-neutral-300 px-4 py-2 text-lg capitalize dark:bg-neutral-700"
						bind:value={$calendarOptions.size}
					>
						{#each Object.values(DocSize) as value}
							<option {value}>{value}</option>
						{/each}
					</select>
				</OutlineRow>
			</label>

			<label class="flex flex-col gap-1">
				<p class="px-8 text-sm font-medium">Orientación</p>

				<OutlineRow className="px-4">
					<select
						class="w-full appearance-none rounded-full bg-neutral-300 px-4 py-2 text-lg dark:bg-neutral-700"
						bind:value={$calendarOptions.orientation}
					>
						{#each Object.values(DocOrientation) as value}
							<option {value}>{value === DocOrientation.LANDSCAPE ? 'Apaisado' : 'Vertical'}</option
							>
						{/each}
					</select>
				</OutlineRow>
			</label>
		</div>
		<div class="flex flex-col gap-1">
			<p class="px-8 text-sm font-medium">Estilo</p>

			<OutlineRow className="px-4">
				<div class="grid grid-cols-3 overflow-clip rounded-full bg-neutral-300 dark:bg-neutral-700">
					<label
						class="{calendarStyle === 'single'
							? 'bg-blue-800 text-neutral-50 dark:bg-blue-600'
							: 'bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50'} flex cursor-pointer items-center justify-center gap-1 p-3"
					>
						<p class="text-sm font-medium">1</p>
						<Page class="size-4" />

						<input class="hidden" type="radio" bind:group={calendarStyle} value="single" />
					</label>

					<label
						class="{calendarStyle === 'multipage'
							? 'bg-blue-800 text-neutral-50 dark:bg-blue-600'
							: 'bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50'} flex cursor-pointer items-center justify-center gap-1 p-3"
					>
						<p class="text-xs font-medium">12</p>
						<Pages class="size-4" />

						<input class="hidden" type="radio" bind:group={calendarStyle} value="multipage" />
					</label>

					<label
						class="{calendarStyle === 'cover'
							? 'bg-blue-800 text-neutral-50 dark:bg-blue-600'
							: 'bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50'} flex cursor-pointer items-center justify-center gap-1 p-3"
					>
						<p class="text-xs font-medium">13</p>
						<Pages class="size-4" />

						<input class="hidden" type="radio" bind:group={calendarStyle} value="cover" />
					</label>
				</div>
			</OutlineRow>
		</div>

		{#if $calendarOptions.holidays && $calendarOptions.multipage}
			<label class="flex flex-col gap-1">
				<p class="text-xs font-medium">Etiquetar festivos</p>

				<select
					class="w-full appearance-none bg-brown-200 px-3 py-2 text-lg outline-none dark:bg-brown-900"
					bind:value={$calendarOptions.labelHolidays}
				>
					<option value={true}>Si</option>
					<option value={false}>No</option>
				</select>
			</label>
		{/if}

		{#if $calendarOptions.multipage}
			<details class="flex w-full flex-col gap-1">
				<summary class="text-sm font-medium">Imagenes</summary>

				<div class="grid grid-cols-3 gap-2">
					{#if $calendarOptions.cover}
						<ImageUploader monthIndex={12} {removeImage} bind:images />
					{/if}

					{#each images as image, monthIndex}
						<ImageUploader {monthIndex} {removeImage} bind:images />
					{/each}
				</div>
			</details>
		{/if}

		<OutlineRow className="px-4 mt-4">
			<Button className="w-full" type="button" onclick={downloadPDF}>Descargar PDF</Button>
		</OutlineRow>
	</form>
</aside>
