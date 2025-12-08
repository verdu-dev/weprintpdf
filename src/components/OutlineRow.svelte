<script>
	let { children, className = null } = $props();
</script>

<div
	class={`
		${className}
		relative bg-brown-50 *:relative *:z-10
		before:absolute before:top-0 before:left-0 before:h-px before:w-full before:bg-neutral-300
		after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-neutral-300
		dark:bg-neutral-900 dark:before:bg-neutral-700 dark:after:bg-neutral-700
		`}
>
	{@render children()}
</div>
