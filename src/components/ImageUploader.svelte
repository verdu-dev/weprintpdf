<script lang="ts">
	import { calendarOptions } from '@/lib/stores';
	import Trash from '@/lib/icons/Trash.svelte';
	import Images from '@/lib/icons/Images.svelte';

	export let images: (FileList | null)[];
	export let monthIndex: number;
	export let removeImage: (monthIndex: number) => void;

	const monthEs = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre'
	];
</script>

{#if !$calendarOptions.images[monthIndex]}
	<label class="flex flex-col gap-1">
		<p class="text-sm font-medium">{monthIndex === 12 ? 'Portada' : monthEs[monthIndex]}</p>

		<input
			class="hidden"
			type="file"
			accept="image/png, image/jpeg, image/webp, image/avif"
			bind:files={images[monthIndex]}
		/>

		<div class="flex aspect-3/4 flex-col items-center justify-center gap-4 bg-brown-200 p-2">
			<Images class="size-5" />
			<p class="text-center text-xs leading-none font-medium">Añadir imagen</p>
		</div>
	</label>
{:else}
	<div class="flex flex-col gap-1">
		<p class="text-sm font-medium">{monthIndex === 12 ? 'Portada' : monthEs[monthIndex]}</p>

		<div class="relative aspect-3/4 border border-neutral-300 bg-neutral-700">
			<img
				class="size-full object-cover"
				src={$calendarOptions.images[monthIndex]?.img.src}
				alt="Imagen {monthIndex === 12 ? 'Portada' : monthEs[monthIndex]}"
			/>
			<button
				class="absolute bottom-0 flex w-full cursor-pointer justify-center bg-brown-200/50 p-1"
				on:click={() => removeImage(monthIndex)}
			>
				<Trash class="size-6" />
			</button>
		</div>
	</div>
{/if}
