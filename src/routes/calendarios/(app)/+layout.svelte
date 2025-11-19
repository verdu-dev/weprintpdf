<script lang="ts">
	import CalendarContainer from '@/components/calendar/CalendarContainer.svelte';

	let { children } = $props();
</script>

<main class="flex w-full flex-col items-center">
	{@render children()}

	<CalendarContainer />
</main>
