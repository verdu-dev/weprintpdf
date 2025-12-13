<script lang="ts">
	import CalendarOptions from '@/components/calendar/CalendarOptions.svelte';
	import CalendarDisplay from '@/components/calendar/CalendarDisplay.svelte';

	let mobileView = 'options';

	function scrollView(ev: Event) {
		const target = ev.target as HTMLAnchorElement;
		const targetId = target.getAttribute('href')!;
		const targetSection = document.querySelector(targetId) as HTMLElement;

		mobileView = targetId === '#options' ? 'options' : 'preview';

		if (targetSection) {
			targetSection.scrollIntoView({
				behavior: 'smooth',
				inline: 'center',
				block: 'nearest'
			});
		}
	}
</script>

<section id="crear" class="relative h-svh w-full pt-16">
	<div
		class="inline-flex size-full gap-2 overflow-x-hidden border-y border-neutral-300 bg-neutral-200 p-2 scrollbar-none md:grid md:grid-cols-[350px_1fr] md:grid-rows-[100%] dark:border-neutral-700 dark:bg-neutral-800"
	>
		<CalendarOptions />
		<CalendarDisplay />

		<div class="absolute bottom-2 left-0 block h-[62px] w-full px-2 md:hidden">
			<div
				class="flex items-center rounded-full border border-neutral-300 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-900"
			>
				<a
					href="#options"
					class="flex-1 rounded-full px-4 py-3 text-center {mobileView === 'options'
						? 'bg-blue-800 text-neutral-50 dark:bg-blue-600'
						: ''}"
					on:click|preventDefault={scrollView}
				>
					Opciones
				</a>
				<a
					href="#preview"
					class="flex-1 rounded-full px-4 py-3 text-center {mobileView === 'preview'
						? 'bg-blue-800 text-neutral-50 dark:bg-blue-600'
						: ''}"
					on:click|preventDefault={scrollView}
				>
					Vista previa
				</a>
			</div>
		</div>
	</div>
</section>
