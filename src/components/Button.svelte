<script>
	let { children, onclick = null, className = null, type = null } = $props();
</script>

<button
	class="{className} cursor-pointer rounded-full bg-neutral-950 px-6 py-2.5 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
	{type}
	{onclick}
>
	{@render children()}
</button>
