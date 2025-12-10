<script lang="ts">
	import OutlineRow from '@/components/OutlineRow.svelte';
	import ToolCard from '@/components/ToolCard.svelte';
	import { tools } from '@/lib/tools';
	import { searchTerm } from '@/lib/stores';

	function formatText(text: string) {
		return text
			.toString()
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	}

	$: filteredTools = tools.filter((tool) => {
		if (!$searchTerm.trim()) return true;

		const cleanText = formatText(tool.description);
		const words = formatText($searchTerm)
			.split(/\s+/)
			.filter((word) => word.length > 0);

		return words.every((word) => cleanText.includes(word));
	});

	$: console.log(filteredTools);
</script>

<section id="tools" class="py-10">
	<OutlineRow className="bg-transparent">
		<div class="relative">
			<div
				class="pointer-events-none absolute -inset-px z-20 grid grid-cols-2 gap-x-10 overflow-clip lg:grid-cols-3 xl:grid-cols-4"
				aria-hidden="true"
			>
				{#each tools as _}
					<div class="h-dvh border-x border-neutral-300 dark:border-neutral-700"></div>
				{/each}
			</div>
			<ul
				class="grid grid-cols-2 gap-10 overflow-clip lg:grid-cols-3 xl:grid-cols-4 dark:border-neutral-700 dark:bg-neutral-900"
			>
				{#each filteredTools as tool (tool.name)}
					<li
						class={`
							relative
							before:absolute before:bottom-0 before:left-[-100vw] before:z-10 before:h-px before:w-[200vw] before:bg-neutral-300 after:absolute
							after:top-0 after:left-[-100vw] after:z-10 after:h-px after:w-[200vw] after:bg-neutral-300 dark:before:bg-neutral-700 dark:after:bg-neutral-700
					`}
					>
						<ToolCard {tool} />
					</li>
				{/each}
			</ul>
		</div>
	</OutlineRow>
</section>
