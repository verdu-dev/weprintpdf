<script lang="ts">
	import OutlineRow from '@/components/OutlineRow.svelte';
</script>

<section class="flex flex-col gap-4 pt-8">
	<OutlineRow>
		<h1 class="p-4 text-6xl font-medium">Calendario anual</h1>
	</OutlineRow>

	<OutlineRow className="flex flex-col items-start">
		<p class="p-4 text-lg">Calendario anual personalizable de una sola página para este año.</p>

		<OutlineRow className="w-full px-4 py-2.5 mb-4">
			<a
				class=" bg-neutral-900 px-4 py-3 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
				href="#crear"
			>
				Crear calendario
			</a>
		</OutlineRow>
	</OutlineRow>
</section>
