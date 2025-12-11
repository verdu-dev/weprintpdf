<script>
	let { children, href = null, className = null } = $props();
</script>

<a
	class="{className} rounded-full bg-neutral-950 px-6 py-2.5 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
	{href}
>
	{@render children()}
</a>
