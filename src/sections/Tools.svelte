<script>
	import ToolCard from '@/components/ToolCard.svelte';
	import { tools } from '@/lib/tools';
</script>

<section id="tools" class="px-6 py-3">
	<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
		{#each tools as tool}
			<li>
				<ToolCard {tool} />
			</li>
		{/each}
	</ul>
</section>
