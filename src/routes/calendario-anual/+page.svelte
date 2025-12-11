<script lang="ts">
	import Link from '@/components/Link.svelte';
	import OutlineRow from '@/components/OutlineRow.svelte';
</script>

<section class="flex flex-col gap-4 pt-8">
	<OutlineRow className="pt-16 pb-8 gap-6 flex flex-col">
		<OutlineRow>
			<h1 class="px-6 text-7xl font-medium">Calendario anual</h1>
		</OutlineRow>

		<OutlineRow>
			<p class="px-6 text-xl">Calendario anual personalizable de una sola página para este año.</p>
		</OutlineRow>

		<OutlineRow className="px-6 py-2.5">
			<Link href="#crear">Crear calendario</Link>
		</OutlineRow>
	</OutlineRow>
</section>
