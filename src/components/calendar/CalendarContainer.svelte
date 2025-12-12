<script>
	import CalendarOptions from '@/components/calendar/CalendarOptions.svelte';
	import CalendarDisplay from '@/components/calendar/CalendarDisplay.svelte';
	import OutlineRow from '@/components/OutlineRow.svelte';
</script>

<section id="crear" class="h-svh w-full pt-16">
	<div
		class="grid size-full grid-cols-[350px_1fr] gap-2 border-y border-neutral-300 bg-neutral-200 p-2 dark:border-neutral-700 dark:bg-neutral-800"
	>
		<CalendarOptions />
		<CalendarDisplay />
	</div>
</section>
