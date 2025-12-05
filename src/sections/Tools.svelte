<script>
	import OutlineRow from '@/components/OutlineRow.svelte';
	import ToolCard from '@/components/ToolCard.svelte';
	import { tools } from '@/lib/tools';
</script>

<section id="tools">
	<OutlineRow>
		<ul
			class="mt-8 grid grid-cols-2 gap-px bg-neutral-300 lg:grid-cols-3 xl:grid-cols-4 dark:bg-neutral-700"
		>
			{#each tools as tool}
				<li>
					<ToolCard {tool} />
				</li>
			{/each}
		</ul>
	</OutlineRow>
</section>
