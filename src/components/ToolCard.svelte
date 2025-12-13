<script lang="ts">
	import type { Tool } from '@/lib/types';

	export let tool: Tool;
	const { image, createdAt, icon, name, description, slug } = tool;

	const isNew = (() => {
		const createdDate = new Date(createdAt);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - createdDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays <= 30;
	})();
</script>

<a href={`/${slug}`}>
	<article
		class={`
			relative flex h-full flex-col gap-2 bg-brown-50 p-4 transition-colors squircle
		hover:bg-neutral-200 
		dark:bg-neutral-900 dark:hover:bg-neutral-800
		`}
	>
		{#if isNew}
			<div class="absolute top-3 right-3 rounded-full bg-blue-800 p-1.5 dark:bg-blue-500">
				<span class="sr-only">NUEVO</span>
			</div>
		{/if}

		{#if image}
			<img src={`/images/${image}`} alt={name} />
		{/if}

		<figure>
			<span class="font-brand text-5xl text-neutral-900 dark:text-neutral-50">{icon}</span
			>
		</figure>

		<h2 class="text-xl font-medium">{name}</h2>
		<p>{description}</p>
	</article>
</a>
