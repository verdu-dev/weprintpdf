<script>
	import Logo from '@/lib/icons/Logo.svelte';
	import Theme from '@/lib/icons/Theme.svelte';

	function toggleTheme() {
		const isDark = document.documentElement.classList.toggle('dark');

		if (isDark) localStorage.theme = 'dark';
		else localStorage.theme = 'light';
	}
</script>

<header
	class="sticky top-0 z-40 flex h-16 border-b border-neutral-300 bg-brown-50 p-3 dark:border-neutral-700 dark:bg-neutral-900"
>
	<div class="mx-auto flex w-full max-w-[1600px] items-center justify-between md:px-14">
		<a href="/">
			<Logo class="h-10" />
		</a>

		<div class="flex items-center gap-5">
			<nav class="hidden items-center gap-5 md:flex">
				<a href="/">Home</a>
				<a href="/calendario-anual">Anual</a>
				<a href="/calendario-mensual">Mensual</a>
			</nav>

			<button class="cursor-pointer" onclick={toggleTheme}>
				<Theme class="size-6" />
			</button>
		</div>
	</div>
</header>
