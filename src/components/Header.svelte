<script>
	import Logo from '@/lib/icons/Logo.svelte';
	import Theme from '@/lib/icons/Theme.svelte';

	function toggleTheme() {
		const isDark = document.documentElement.classList.toggle('dark');

		if (isDark) localStorage.theme = 'dark';
		else localStorage.theme = 'light';
	}
</script>

<header class="flex border-b border-neutral-300 p-3 dark:border-neutral-700">
	<div class="mx-auto flex w-full max-w-[1600px] items-center justify-between px-16">
		<a href="/">
			<Logo class="h-10" />
		</a>

		<button class="cursor-pointer" onclick={toggleTheme}>
			<Theme class="size-6" />
		</button>
	</div>
</header>
