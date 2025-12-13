<script lang="ts">
	import type { LayoutProps } from './$types';
	import { setContext } from 'svelte';
	import CalendarContainer from '@/components/calendar/CalendarContainer.svelte';

	let { children, data }: LayoutProps = $props();
	setContext('pathname', () => data.pathname);
</script>

<main>
	{@render children()}
	<CalendarContainer />
</main>
