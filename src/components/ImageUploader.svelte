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

<div class="flex flex-col gap-1">
	<p class="text-sm font-medium">
		{monthIndex === 12 ? 'Portada' : monthEs[monthIndex]}
	</p>

	<div class="relative aspect-3/4">
		<label class="cursor-pointer">
			<input
				class="hidden"
				type="file"
				accept="image/png, image/jpeg, image/webp, image/avif"
				bind:files={images[monthIndex]}
			/>

			<div
				class="flex size-full flex-col items-center justify-center gap-2 overflow-clip rounded-2xl bg-neutral-300 squircle dark:bg-neutral-700"
			>
				{#if !$calendarOptions.images[monthIndex]}
					<Images class="size-5" />
					<p class="px-2 text-center text-xs leading-none font-medium">Añadir</p>
				{:else}
					<img
						class=" size-full object-cover"
						src={$calendarOptions.images[monthIndex]?.img.src}
						alt="Imagen {monthIndex === 12 ? 'Portada' : monthEs[monthIndex]}"
					/>
				{/if}
			</div>
		</label>

		{#if $calendarOptions.images[monthIndex]}
			<div class="absolute bottom-0 w-full p-1.5">
				<button
					class="flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-neutral-300 p-1.5 squircle dark:bg-neutral-700"
					on:click={() => removeImage(monthIndex)}
				>
					<Trash class="size-4" />
					<p class="text-xs font-medium">Borrar</p>
				</button>
			</div>
		{/if}
	</div>
</div>
