<script lang="ts">
	import type { Tool } from '@/lib/types';

	export let tool: Tool;
	const { createdAt, icon, name, description, category, slug } = tool;

	const isNew = (() => {
		const createdDate = new Date(createdAt);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - createdDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays <= 30;
	})();
</script>

<a href={`/${category}/${slug}`}>
	<article
		class="relative flex flex-col gap-2 rounded-3xl border border-neutral-300 p-4 transition-colors squircle hover:bg-neutral-900 hover:text-white"
	>
		{#if isNew}
			<div class="absolute top-3 right-3 rounded-full bg-red-500 p-1.5">
				<span class="sr-only">NUEVO</span>
			</div>
		{/if}

		<figure>
			<span class="font-brand text-5xl text-neutral-600">{icon}</span>
		</figure>

		<h2 class="text-lg font-semibold">{name}</h2>
		<p>{description}</p>
	</article>
</a>
