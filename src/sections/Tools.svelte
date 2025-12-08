<script>
	import OutlineRow from '@/components/OutlineRow.svelte';
	import ToolCard from '@/components/ToolCard.svelte';
	import { tools } from '@/lib/tools';
</script>

<section id="tools">
	<OutlineRow>
		<div class="relative">
			<div
				class="pointer-events-none absolute -inset-px z-20 grid grid-cols-2 gap-x-12 lg:grid-cols-3 xl:grid-cols-4"
			>
				{#each tools as _}
					<div class="border-x border-neutral-300 dark:border-neutral-700"></div>
				{/each}
			</div>
			<ul
				class="mt-8 grid grid-cols-2 gap-12 overflow-clip bg-brown-50 lg:grid-cols-3 xl:grid-cols-4 dark:border-neutral-700 dark:bg-neutral-900"
			>
				{#each tools as tool}
					<li
						class={`
							relative
							before:absolute before:bottom-0 before:left-[-100vw] before:z-10 before:h-px before:w-[200vw] before:bg-neutral-300 after:absolute
							after:top-0 after:left-[-100vw] after:z-10 after:h-px after:w-[200vw] after:bg-neutral-300 dark:before:bg-neutral-700 dark:after:bg-neutral-700
					`}
					>
						<ToolCard {tool} />
					</li>
					<li
						class={`
							relative
							before:absolute before:bottom-0 before:left-[-100vw] before:z-10 before:h-px before:w-[200vw] before:bg-neutral-300 after:absolute
							after:top-0 after:left-[-100vw] after:z-10 after:h-px after:w-[200vw] after:bg-neutral-300 dark:before:bg-neutral-700 dark:after:bg-neutral-700
					`}
					>
						<ToolCard {tool} />
					</li>
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
