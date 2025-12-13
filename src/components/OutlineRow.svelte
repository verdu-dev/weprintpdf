<script>
	let { children, className = null } = $props();
</script>

<div
	class={`
		${className}
		border-y border-neutral-300 bg-brown-50
		dark:border-neutral-700 dark:bg-neutral-900 dark:before:bg-neutral-700 dark:after:bg-neutral-700
		`}
>
	{@render children()}
</div>
